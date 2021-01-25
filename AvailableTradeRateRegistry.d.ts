import {
  ConstructorRegistry,
  IConstructorRegistry,
} from '@civ-clone/core-registry/ConstructorRegistry';
import TradeRate from './TradeRate';
export interface IAvailableTradeRateRegistry
  extends IConstructorRegistry<TradeRate> {}
export declare class AvailableTradeRateRegistry
  extends ConstructorRegistry<TradeRate>
  implements IAvailableTradeRateRegistry {
  constructor();
}
export declare const instance: AvailableTradeRateRegistry;
export default AvailableTradeRateRegistry;
