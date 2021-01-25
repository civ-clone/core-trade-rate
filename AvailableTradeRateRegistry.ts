import {
  ConstructorRegistry,
  IConstructorRegistry,
} from '@civ-clone/core-registry/ConstructorRegistry';
import TradeRate from './TradeRate';

export interface IAvailableTradeRateRegistry
  extends IConstructorRegistry<TradeRate> {}

export class AvailableTradeRateRegistry
  extends ConstructorRegistry<TradeRate>
  implements IAvailableTradeRateRegistry {
  constructor() {
    super(TradeRate);
  }
}

export const instance: AvailableTradeRateRegistry = new AvailableTradeRateRegistry();

export default AvailableTradeRateRegistry;
