import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import ExcessRate from '../Rules/ExcessRate';
import MaxRate from '../Rules/MaxRate';
import Player from '@civ-clone/core-player/Player';
import PlayerTradeRates from '../PlayerTradeRates';
import PlayerTradeRatesRegistry from '../PlayerTradeRatesRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TradeRate from '../TradeRate';
import { expect } from 'chai';
import maxRates from '../maxRates';

class Tax extends TradeRate {}
class Luxuries extends TradeRate {}
class Research extends TradeRate {}

const values = (rates: PlayerTradeRates): number[] =>
  [Tax, Luxuries, Research].map((Type) => rates.get(Type).value());

const noDraws = (): number => {
  throw new Error('drew a number');
};

describe('MaxRate', (): void => {
  const setUp = (
    tax: number,
    luxuries: number,
    research: number,
    ruleRegistry = new RuleRegistry(),
    rng: () => number = noDraws
  ) =>
    new PlayerTradeRates(
      new Player(ruleRegistry),
      new Tax(tax),
      new Luxuries(luxuries),
      new Research(research),
      rng,
      ruleRegistry
    );

  // One maximum for every rate, and the excess to tax first, as the original's rates dialog does: tax's to research,
  //  then luxuries; research's to tax, then luxuries; luxuries' to tax, then research.
  const capped = (maximum: number, ruleRegistry = new RuleRegistry()) => {
    ruleRegistry.register(
      new MaxRate(new Effect(() => maximum)),
      new ExcessRate(
        new Criterion((player, rate) => rate instanceof Tax),
        new Effect(() => [Research, Luxuries])
      ),
      new ExcessRate(
        new Criterion((player, rate) => rate instanceof Research),
        new Effect(() => [Tax, Luxuries])
      ),
      new ExcessRate(
        new Criterion((player, rate) => rate instanceof Luxuries),
        new Effect(() => [Tax, Research])
      )
    );

    return ruleRegistry;
  };

  describe('with no `MaxRate` rules', (): void => {
    it('has no maximum, and changes nothing', (): void => {
      const rates = setUp(0, 0, 100);

      expect(rates.maxRate(Tax)).to.equal(undefined);
      expect(rates.maxRates().map(([, maximum]) => maximum)).to.deep.equal([
        undefined,
        undefined,
        undefined,
      ]);
      expect(rates.enforceMaxRates()).to.equal(false);

      rates.setAll([
        [Tax, 100],
        [Luxuries, 0],
        [Research, 0],
      ]);

      expect(values(rates)).to.deep.equal([100, 0, 0]);

      rates.set(Research, 90);

      expect(values(rates)).to.deep.equal([10, 0, 90]);
    });

    it('keeps the rule registry out of what is saved', (): void => {
      const rates = setUp(40, 0, 60);

      expect(rates.stateKeys()).not.to.include('_ruleRegistry');
      expect(PlayerTradeRates.transient).to.include('_ruleRegistry');
    });
  });

  describe('with `MaxRate` rules', (): void => {
    it('takes the lowest answer, from 0 to 1, ignoring rules with none', (): void => {
      const ruleRegistry = new RuleRegistry();

      ruleRegistry.register(
        new MaxRate(new Effect(() => 0.8)),
        new MaxRate(new Effect(() => undefined)),
        new MaxRate(
          new Criterion((player, rate) => rate instanceof Research),
          new Effect(() => 0.5)
        ),
        new MaxRate(
          new Criterion((player, rate) => rate instanceof Luxuries),
          new Effect(() => 2)
        )
      );

      const rates = setUp(40, 0, 60, ruleRegistry);

      expect(
        rates.maxRates().map(([rate, maximum]) => [rate.constructor, maximum])
      ).to.deep.equal([
        [Tax, 0.8],
        [Luxuries, 0.8],
        [Research, 0.5],
      ]);
    });

    it('reshapes rates that come to 100 to the maximum, without refusing them', (): void => {
      const rates = setUp(40, 0, 60, capped(0.6));

      rates.setAll([
        [Tax, 70],
        [Luxuries, 0],
        [Research, 30],
      ]);

      expect(values(rates)).to.deep.equal([60, 0, 40]);

      rates.setAll([
        [Tax, 100],
        [Luxuries, 0],
        [Research, 0],
      ]);

      expect(values(rates)).to.deep.equal([60, 0, 40]);

      rates.setAll([
        [Tax, 0],
        [Luxuries, 30],
        [Research, 70],
      ]);

      expect(values(rates)).to.deep.equal([10, 30, 60]);

      rates.setAll([
        [Tax, 30],
        [Luxuries, 70],
        [Research, 0],
      ]);

      expect(values(rates)).to.deep.equal([40, 60, 0]);
    });

    it('moves the excess on to the next rate when the first is full', (): void => {
      const rates = setUp(40, 0, 60, capped(0.6));

      rates.setAll([
        [Tax, 40],
        [Luxuries, 0],
        [Research, 60],
      ]);
      rates.setAll([
        [Tax, 0],
        [Luxuries, 100],
        [Research, 0],
      ]);

      // Luxuries' 40 over goes to tax, which takes all of it.
      expect(values(rates)).to.deep.equal([40, 60, 0]);

      const full = setUp(40, 20, 40, capped(0.4));

      full.setAll([
        [Tax, 70],
        [Luxuries, 0],
        [Research, 30],
      ]);

      // Tax's 30 over: research takes the 10 it has room for, and luxuries the other 20.
      expect(values(full)).to.deep.equal([40, 20, 40]);
    });

    it("still refuses rates that don't come to 100", (): void => {
      const rates = setUp(40, 0, 60, capped(0.6));

      expect(() =>
        rates.setAll([
          [Tax, 70],
          [Luxuries, 0],
          [Research, 40],
        ])
      ).to.throw(TypeError);
      expect(values(rates)).to.deep.equal([40, 0, 60]);
    });

    it('gives the excess to the other rates in order with no `ExcessRate` rule', (): void => {
      const ruleRegistry = new RuleRegistry();

      ruleRegistry.register(new MaxRate(new Effect(() => 0.6)));

      const rates = setUp(40, 0, 60, ruleRegistry);

      rates.setAll([
        [Tax, 0],
        [Luxuries, 0],
        [Research, 100],
      ]);

      expect(values(rates)).to.deep.equal([40, 0, 60]);
    });

    it("leaves what no rate can take where it was, rather than failing, when the maximums can't make 100", (): void => {
      const rates = setUp(40, 0, 60, capped(0.3));

      expect(() =>
        rates.setAll([
          [Tax, 100],
          [Luxuries, 0],
          [Research, 0],
        ])
      ).not.to.throw();
      expect(values(rates)).to.deep.equal([40, 30, 30]);
      expect(rates.total()).to.equal(100);
    });

    it('sets one rate no higher than its maximum, and shares the rest as before', (): void => {
      const rates = setUp(40, 20, 40, capped(0.7));

      rates.set(Tax, 90);

      expect(values(rates)).to.deep.equal([70, 10, 20]);
    });

    it('reads 0.7 as 70, not a little over', (): void => {
      const rates = setUp(30, 0, 70, capped(0.7));

      expect(rates.enforceMaxRates()).to.equal(false);
      expect(values(rates)).to.deep.equal([30, 0, 70]);
    });

    it('brings rates already over a new maximum down when asked', (): void => {
      const ruleRegistry = new RuleRegistry(),
        rates = setUp(20, 0, 80, ruleRegistry);

      capped(0.6, ruleRegistry);

      expect(rates.enforceMaxRates()).to.equal(true);
      expect(values(rates)).to.deep.equal([40, 0, 60]);
      expect(rates.enforceMaxRates()).to.equal(false);
    });

    it('answers for a player through the registry', (): void => {
      const rates = setUp(40, 0, 60, capped(0.6)),
        playerTradeRatesRegistry = new PlayerTradeRatesRegistry();

      playerTradeRatesRegistry.register(rates);

      expect(
        maxRates(rates.player(), playerTradeRatesRegistry).map(
          ([, maximum]) => maximum
        )
      ).to.deep.equal([0.6, 0.6, 0.6]);
    });
  });
});
