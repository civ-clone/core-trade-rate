import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from './PlayerTradeRatesRegistry';
import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';

/**
 * Each of `player`'s rates, with the most they may put into it, as a fraction of their trade from 0 to 1, or
 *  `undefined` for no limit (`MaxRate`).
 */
export const maxRates = (
  player: Player,
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance
): [TradeRate, number | undefined][] =>
  playerTradeRatesRegistry.getByPlayer(player).maxRates();

export default maxRates;
