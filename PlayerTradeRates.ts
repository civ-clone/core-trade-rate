import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';

export interface IPlayerTradeRates {
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
  get(Type: typeof TradeRate): TradeRate;
  player(): Player;
  set(Type: typeof TradeRate, value: number): void;
  total(): number;
}

export class PlayerTradeRates implements IPlayerTradeRates {
  #fudgeFactor: number = 100;
  #player: Player;
  #rates: TradeRate[] = [];

  constructor(player: Player, ...rates: TradeRate[]) {
    this.#player = player;
    this.#rates = rates;
  }

  all(): TradeRate[] {
    return [...this.#rates];
  }

  balance(fixed: TradeRate): void {
    if (this.total() === 1) {
      return;
    }

    const available = 1 - fixed.value(),
      others = this.#rates.filter((rate: TradeRate) => rate !== fixed),
      current = others.reduce(
        (total: number, rate: TradeRate): number => total + rate.value(),
        0
      );
    others.forEach((rate: TradeRate): void =>
      rate.set((rate.value() / current) * available)
    );

    if (this.total() < 1) {
      others[Math.floor(others.length * Math.random())].add(1 - this.total());
    }

    if (this.total() > 1) {
      others[Math.floor(others.length * Math.random())].subtract(
        1 - this.total()
      );
    }
  }

  get(TradeRateType: typeof TradeRate): TradeRate {
    const [tradeRate] = this.#rates.filter(
      (rate: TradeRate): boolean => rate instanceof TradeRateType
    );

    return tradeRate;
  }

  player(): Player {
    return this.#player;
  }

  set(Type: typeof TradeRate, value: number): void {
    const rate = this.get(Type);

    rate.set(value);

    this.balance(rate);
  }

  total(): number {
    return (
      Math.round(
        this.#rates.reduce(
          (total: number, rate: TradeRate): number => total + rate.value(),
          0
        ) * this.#fudgeFactor
      ) / this.#fudgeFactor
    );
  }
}

export default PlayerTradeRates;
