import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';
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
export declare class PlayerTradeRates
  extends DataObject
  implements IPlayerTradeRates
{
  static readonly transient: string[];
  private _player;
  private _randomNumberGenerator;
  private _rates;
  private _ruleRegistry;
  constructor(
    player: Player,
    ...rates: (TradeRate | (() => number) | RuleRegistry)[]
  );
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
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
  enforceMaxRates(fixed?: TradeRate): boolean;
  get(TradeRateType: typeof TradeRate): TradeRate;
  /**
   * The most the player may put into `Type`, as a fraction of their trade from 0 to 1: the lowest of the `MaxRate`
   *  rules' answers, or `undefined` when none gives one.
   */
  maxRate(Type: typeof TradeRate): number | undefined;
  /**
   * Each of the player's rates, with the most they may put into it (`maxRate`).
   */
  maxRates(): [TradeRate, number | undefined][];
  player(): Player;
  /**
   * Sets one rate, no higher than its maximum, and shares what's left between the others as they were.
   */
  set(Type: typeof TradeRate, value: number): void;
  setAll(ratesAndValues: [typeof TradeRate, number][]): void;
  private excessTo;
  total(): number;
}
export default PlayerTradeRates;
