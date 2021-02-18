"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const PlayerTradeRatesRegistry_1 = require("../PlayerTradeRatesRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const Player_1 = require("@civ-clone/core-player/Player");
const getAdditionalData = (playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance) => [
    new AdditionalData_1.default(Player_1.default, 'rates', (player) => playerTradeRatesRegistry.getByPlayer(player)),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=rates.js.map