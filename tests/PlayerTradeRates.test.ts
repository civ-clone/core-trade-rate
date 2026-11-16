import Player from '@civ-clone/core-player/Player';
import PlayerTradeRates from '../PlayerTradeRates';
import TradeRate from '../TradeRate';
import { expect } from 'chai';

class Tax extends TradeRate {}
class Luxuries extends TradeRate {}
class Research extends TradeRate {}

// A generator that answers from `draws` in turn and remembers how often it was asked.
const generator = (...draws: number[]) => {
  const rng = (): number => {
    rng.calls++;

    return draws.shift() ?? 0;
  };

  rng.calls = 0;

  return rng;
};

const values = (rates: PlayerTradeRates): number[] =>
  [Tax, Luxuries, Research].map((Type) => rates.get(Type).value());

describe('PlayerTradeRates', (): void => {
  const setUp = (
    tax: number,
    luxuries: number,
    research: number,
    rng = generator()
  ) =>
    new PlayerTradeRates(
      new Player(),
      new Tax(tax),
      new Luxuries(luxuries),
      new Research(research),
      rng
    );

  it('sets every rate at once when they come to 100', (): void => {
    const rates = setUp(30, 0, 70);

    rates.setAll([
      [Tax, 50],
      [Luxuries, 10],
      [Research, 40],
    ]);

    expect(values(rates)).to.deep.equal([50, 10, 40]);
  });

  it("refuses rates that don't come to 100, and changes nothing", (): void => {
    const rates = setUp(30, 0, 70);

    expect(() =>
      rates.setAll([
        [Tax, 50],
        [Luxuries, 10],
        [Research, 50],
      ])
    ).to.throw(TypeError, 'Invalid rates provided, must sum to 100.');
    expect(values(rates)).to.deep.equal([30, 0, 70]);
  });

  it('shares what one rate leaves between the others, as they were, without a draw when it comes out even', (): void => {
    const rng = generator(),
      rates = setUp(40, 20, 40, rng);

    rates.set(Tax, 70);

    expect(values(rates)).to.deep.equal([70, 10, 20]);
    expect(rng.calls).to.equal(0);
  });

  it('gives the rounding to a rate the generator picks', (): void => {
    const first = generator(0.1),
      last = generator(0.9),
      toFirst = setUp(10, 10, 80, first),
      toLast = setUp(10, 10, 80, last);

    toFirst.set(Tax, 25);
    toLast.set(Tax, 25);

    expect(first.calls).to.equal(1);
    expect(last.calls).to.equal(1);
    expect(values(toFirst)).to.deep.equal([
      25, 8.333333333333346, 66.66666666666666,
    ]);
    expect(values(toLast)).to.deep.equal([
      25, 8.333333333333332, 66.66666666666667,
    ]);
  });

  it('draws nothing when the rates already come to 100', (): void => {
    const rng = generator(),
      rates = setUp(40, 20, 40, rng);

    rates.set(Tax, 40);

    expect(values(rates)).to.deep.equal([40, 20, 40]);
    expect(rng.calls).to.equal(0);
  });
});
