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
export declare class PlayerTradeRates implements IPlayerTradeRates {
  #private;
  constructor(player: Player, ...rates: TradeRate[]);
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
  get(TradeRateType: typeof TradeRate): TradeRate;
  player(): Player;
  set(Type: typeof TradeRate, value: number): void;
  total(): number;
}
export default PlayerTradeRates;
