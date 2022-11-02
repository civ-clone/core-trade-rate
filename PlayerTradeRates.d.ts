import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';
export interface IPlayerTradeRates extends IDataObject {
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
  get(Type: typeof TradeRate): TradeRate;
  player(): Player;
  set(Type: typeof TradeRate, value: number): void;
  setAll(ratesAndValues: [typeof TradeRate, number][]): void;
  total(): number;
}
export declare class PlayerTradeRates
  extends DataObject
  implements IPlayerTradeRates
{
  #private;
  constructor(player: Player, ...rates: TradeRate[]);
  all(): TradeRate[];
  balance(fixed: TradeRate): void;
  get(TradeRateType: typeof TradeRate): TradeRate;
  player(): Player;
  set(Type: typeof TradeRate, value: number): void;
  setAll(ratesAndValues: [typeof TradeRate, number][]): void;
  total(): number;
}
export default PlayerTradeRates;
