"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxRate = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
/**
 * The most `player` may put into `rate`, as a fraction of their trade from 0 to 1, or `undefined` for no limit. With
 *  more than one answer the lowest holds; with none, there is no limit.
 */
class MaxRate extends Rule_1.default {
}
exports.MaxRate = MaxRate;
exports.default = MaxRate;
//# sourceMappingURL=MaxRate.js.map