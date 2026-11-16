"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxRates = void 0;
const PlayerTradeRatesRegistry_1 = require("./PlayerTradeRatesRegistry");
/**
 * Each of `player`'s rates, with the most they may put into it, as a fraction of their trade from 0 to 1, or
 *  `undefined` for no limit (`MaxRate`).
 */
const maxRates = (player, playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance) => playerTradeRatesRegistry.getByPlayer(player).maxRates();
exports.maxRates = maxRates;
exports.default = exports.maxRates;
//# sourceMappingURL=maxRates.js.map