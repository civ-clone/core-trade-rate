import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '../PlayerTradeRatesRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import Player from '@civ-clone/core-player/Player';
import PlayerTradeRates from '../PlayerTradeRates';

export const getAdditionalData: (
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry
) => AdditionalData[] = (
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance
): AdditionalData[] => [
  new AdditionalData(
    Player,
    'rates',
    (player: Player): PlayerTradeRates =>
      playerTradeRatesRegistry.getByPlayer(player)
  ),
];

export default getAdditionalData;
