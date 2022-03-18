import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerTradeRates from './PlayerTradeRates';
export interface IPlayerTradeRatesRegistry
  extends IEntityRegistry<PlayerTradeRates> {
  getByPlayer(player: Player): PlayerTradeRates;
}
export declare class PlayerTradeRatesRegistry
  extends EntityRegistry
  implements IPlayerTradeRatesRegistry
{
  constructor();
  getByPlayer(player: Player): PlayerTradeRates;
}
export declare const instance: PlayerTradeRatesRegistry;
export default PlayerTradeRatesRegistry;
