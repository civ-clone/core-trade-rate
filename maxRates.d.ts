import { PlayerTradeRatesRegistry } from './PlayerTradeRatesRegistry';
import Player from '@civ-clone/core-player/Player';
import TradeRate from './TradeRate';
/**
 * Each of `player`'s rates, with the most they may put into it, as a fraction of their trade from 0 to 1, or
 *  `undefined` for no limit (`MaxRate`).
 */
export declare const maxRates: (
  player: Player,
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry
) => [TradeRate, number | undefined][];
export default maxRates;
