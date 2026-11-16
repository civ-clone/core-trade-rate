import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import ExcessRate from './Rules/ExcessRate';
import MaxRate from './Rules/MaxRate';
import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';
import { instance as rngInstance } from '@civ-clone/core-random';

// What's left over from adding and taking fractions: smaller than this, a rate is as it was.
const TOLERANCE = 1e-9;

export interface IPlayerTradeRates extends IDataObject {
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
  enforceMaxRates(fixed?: TradeRate): boolean;
  get(Type: typeof TradeRate): TradeRate;
  maxRate(Type: typeof TradeRate): number | undefined;
  maxRates(): [TradeRate, number | undefined][];
  player(): Player;
  set(Type: typeof TradeRate, value: number): void;
  setAll(ratesAndValues: [typeof TradeRate, number][]): void;
  total(): number;
}

export class PlayerTradeRates extends DataObject implements IPlayerTradeRates {
  static readonly transient = ['_randomNumberGenerator', '_ruleRegistry'];
  private _player: Player;
  private _randomNumberGenerator: () => number = rngInstance;
  private _rates: TradeRate[] = [];
  private _ruleRegistry: RuleRegistry = ruleRegistryInstance;

  // The generator arrives among the variadic arguments, discriminated by type,
  // rather than as a parameter of its own. A rest parameter cannot be followed
  // by another, and inserting one ahead of it would break every existing call
  // — the change has to stay range-compatible within `0.1.x`. This is the
  // pattern `core-diplomacy`'s `Interaction` already uses. The rule registry, which says the most each rate may be
  // (`MaxRate`), arrives the same way.
  constructor(
    player: Player,
    ...rates: (TradeRate | (() => number) | RuleRegistry)[]
  ) {
    super();

    this._player = player;

    rates.forEach((rate: TradeRate | (() => number) | RuleRegistry): void => {
      if (typeof rate === 'function') {
        this._randomNumberGenerator = rate;

        return;
      }

      if (rate instanceof RuleRegistry) {
        this._ruleRegistry = rate;

        return;
      }

      this._rates.push(rate);
    });

    this.addKey('all');
  }

  all(): TradeRate[] {
    return [...this._rates];
  }

  balance(fixed: TradeRate): void {
    if (this.total() === 100) {
      return;
    }

    const available = 100 - fixed.value(),
      others = this._rates.filter((rate: TradeRate) => rate !== fixed),
      current = others.reduce(
        (total: number, rate: TradeRate): number => total + rate.value(),
        0
      );

    // With nothing in the others there's nothing to share by, so they share it evenly. This used to make every other
    //  rate `NaN`; any other case is as it always was.
    others.forEach((rate: TradeRate): void =>
      rate.set(
        current === 0
          ? available / others.length
          : (rate.value() / current) * available
      )
    );

    if (this.total() < 100) {
      others[Math.floor(others.length * this._randomNumberGenerator())].add(
        100 - this.total()
      );
    }

    if (this.total() > 100) {
      others[
        Math.floor(others.length * this._randomNumberGenerator())
      ].subtract(100 - this.total());
    }
  }

  /**
   * Brings any rate over its maximum (`MaxRate`) down to it, and moves what it had over to the rates `ExcessRate`
   *  says, in order, then to any other rate it left out, each taking what it can up to its own maximum. Rates are seen
   *  to in the player's order. What none can take stays where it was, as the maximums then leave no way to make 100.
   *  Answers whether any rate changed (beyond a rounding error, which is left as it is).
   *
   * `fixed` is a rate just set: it takes an excess last, after every other rate, so that what was moved out of it isn't
   *  moved straight back.
   *
   * With no `MaxRate` rules, nothing is ever over, and nothing is asked.
   */
  enforceMaxRates(fixed?: TradeRate): boolean {
    if (this._ruleRegistry.get(MaxRate).length === 0) {
      return false;
    }

    const maximums = new Map<TradeRate, number>(),
      maximumOf = (rate: TradeRate): number =>
        maximums.get(rate) ?? Number.POSITIVE_INFINITY;

    this._rates.forEach((rate: TradeRate): void => {
      const maximum = this.maxRate(rate.sourceClass<typeof TradeRate>());

      if (maximum !== undefined) {
        // In whole hundredths and their fractions, so 0.7 is 70 and not 70.00000000000001.
        maximums.set(rate, Math.round(maximum * 1e6) / 1e4);
      }
    });

    const before = this._rates.map((rate: TradeRate): number => rate.value());

    this._rates.forEach((rate: TradeRate): void => {
      const maximum = maximumOf(rate);

      if (rate.value() <= maximum + TOLERANCE) {
        return;
      }

      let excess = rate.value() - maximum;

      rate.set(maximum);

      this.excessTo(rate, fixed).forEach((recipient: TradeRate): void => {
        const room = maximumOf(recipient) - recipient.value();

        if (excess <= TOLERANCE || room <= TOLERANCE) {
          return;
        }

        const moved = Math.min(room, excess);

        recipient.set(recipient.value() + moved);
        excess -= moved;
      });

      if (excess > TOLERANCE) {
        rate.set(rate.value() + excess);
      }
    });

    return this._rates.some(
      (rate: TradeRate, index: number): boolean =>
        Math.abs(rate.value() - before[index]) > TOLERANCE
    );
  }

  get(TradeRateType: typeof TradeRate): TradeRate {
    const [tradeRate] = this._rates.filter(
      (rate: TradeRate): boolean => rate instanceof TradeRateType
    );

    return tradeRate;
  }

  /**
   * The most the player may put into `Type`, as a fraction of their trade from 0 to 1: the lowest of the `MaxRate`
   *  rules' answers, or `undefined` when none gives one.
   */
  maxRate(Type: typeof TradeRate): number | undefined {
    const rate = this.get(Type);

    if (rate === undefined) {
      return undefined;
    }

    return this._ruleRegistry
      .process(MaxRate, this._player, rate)
      .filter(
        (maximum: number | undefined | void): maximum is number =>
          typeof maximum === 'number' && Number.isFinite(maximum)
      )
      .reduce(
        (lowest: number | undefined, maximum: number): number =>
          Math.max(0, Math.min(1, lowest ?? 1, maximum)),
        undefined
      );
  }

  /**
   * Each of the player's rates, with the most they may put into it (`maxRate`).
   */
  maxRates(): [TradeRate, number | undefined][] {
    return this._rates.map(
      (rate: TradeRate): [TradeRate, number | undefined] => [
        rate,
        this.maxRate(rate.sourceClass<typeof TradeRate>()),
      ]
    );
  }

  player(): Player {
    return this._player;
  }

  /**
   * Sets one rate, no higher than its maximum, and shares what's left between the others as they were.
   */
  set(Type: typeof TradeRate, value: number): void {
    const rate = this.get(Type),
      maximum = this.maxRate(Type);

    rate.set(
      maximum === undefined
        ? value
        : Math.min(value, Math.round(maximum * 1e6) / 1e4)
    );

    this.balance(rate);

    // The rate just set takes an excess last, so a cap doesn't undo the change.
    this.enforceMaxRates(rate);
  }

  setAll(ratesAndValues: [typeof TradeRate, number][]): void {
    if (
      ratesAndValues.reduce((total: number, [, value]) => total + value, 0) !==
      100
    ) {
      throw new TypeError(`Invalid rates provided, must sum to 100.`);
    }

    ratesAndValues.forEach(([Type, value]) => this.get(Type).set(value));

    // Rates that come to 100 are always taken, and reshaped to the maximums.
    this.enforceMaxRates();
  }

  // Where the excess over `rate`'s maximum goes: the rates `ExcessRate`'s first answer gives, in its order, then any
  //  other rate it left out, in the player's order; with no answer, the other rates in the player's order. `fixed`,
  //  the rate just set, goes last whatever the order.
  private excessTo(rate: TradeRate, fixed?: TradeRate): TradeRate[] {
    const [order] = this._ruleRegistry
        .process(ExcessRate, this._player, rate)
        .filter((answer): answer is (typeof TradeRate)[] =>
          Array.isArray(answer)
        ),
      others = this._rates.filter(
        (other: TradeRate): boolean => other !== rate
      );

    const lastly = (rates: TradeRate[]): TradeRate[] =>
      fixed === undefined || !rates.includes(fixed)
        ? rates
        : [...rates.filter((other) => other !== fixed), fixed];

    if (order === undefined) {
      return lastly(others);
    }

    const named = order
      .map((Type: typeof TradeRate): TradeRate | undefined => this.get(Type))
      .filter(
        (
          other: TradeRate | undefined,
          index: number,
          all
        ): other is TradeRate =>
          other !== undefined && other !== rate && all.indexOf(other) === index
      );

    return lastly([
      ...named,
      ...others.filter((other: TradeRate): boolean => !named.includes(other)),
    ]);
  }

  total(): number {
    return this._rates.reduce(
      (total: number, rate: TradeRate) => total + rate.value(),
      0
    );
  }
}

export default PlayerTradeRates;
