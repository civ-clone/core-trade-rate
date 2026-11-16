import Player from '@civ-clone/core-player/Player';
import Rule from '@civ-clone/core-rule/Rule';
import TradeRate from '../TradeRate';
/**
 * Where what `player` has in `rate` over its maximum goes: the rates to move it to, in order, each taking what it can
 *  up to its own maximum. The first answer holds; with none, it goes to the other rates in the player's order.
 */
export declare class ExcessRate extends Rule<
  [player: Player, rate: TradeRate],
  (typeof TradeRate)[] | undefined
> {}
export default ExcessRate;
