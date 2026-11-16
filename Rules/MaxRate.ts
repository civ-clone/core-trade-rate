import Player from '@civ-clone/core-player/Player';
import Rule from '@civ-clone/core-rule/Rule';
import TradeRate from '../TradeRate';

/**
 * The most `player` may put into `rate`, as a fraction of their trade from 0 to 1, or `undefined` for no limit. With
 *  more than one answer the lowest holds; with none, there is no limit.
 */
export class MaxRate extends Rule<
  [player: Player, rate: TradeRate],
  number | undefined
> {}

export default MaxRate;
