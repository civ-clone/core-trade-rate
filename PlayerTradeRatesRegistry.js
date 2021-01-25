"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.PlayerTradeRatesRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const PlayerTradeRates_1 = require("./PlayerTradeRates");
class PlayerTradeRatesRegistry extends EntityRegistry_1.EntityRegistry {
    constructor() {
        super(PlayerTradeRates_1.default);
    }
    getByPlayer(player) {
        const playerTradeRates = this.getBy('player', player);
        if (playerTradeRates.length !== 1) {
            throw new TypeError('Wrong number of PlayerTradeRates for player');
        }
        return playerTradeRates[0];
    }
}
exports.PlayerTradeRatesRegistry = PlayerTradeRatesRegistry;
exports.instance = new PlayerTradeRatesRegistry();
exports.default = PlayerTradeRatesRegistry;
//# sourceMappingURL=PlayerTradeRatesRegistry.js.map