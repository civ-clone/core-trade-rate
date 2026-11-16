"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcessRate = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
/**
 * Where what `player` has in `rate` over its maximum goes: the rates to move it to, in order, each taking what it can
 *  up to its own maximum. The first answer holds; with none, it goes to the other rates in the player's order.
 */
class ExcessRate extends Rule_1.default {
}
exports.ExcessRate = ExcessRate;
exports.default = ExcessRate;
//# sourceMappingURL=ExcessRate.js.map