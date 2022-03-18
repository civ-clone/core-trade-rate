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

export class PlayerTradeRatesRegistry
  extends EntityRegistry
  implements IPlayerTradeRatesRegistry
{
  constructor() {
    super(PlayerTradeRates);
  }

  getByPlayer(player: Player): PlayerTradeRates {
    const playerTradeRates = this.getBy('player', player);

    if (playerTradeRates.length !== 1) {
      throw new TypeError('Wrong number of PlayerTradeRates for player');
    }

    return playerTradeRates[0];
  }
}

export const instance: PlayerTradeRatesRegistry =
  new PlayerTradeRatesRegistry();

export default PlayerTradeRatesRegistry;
