"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.AvailableTradeRateRegistry = void 0;
const ConstructorRegistry_1 = require("@civ-clone/core-registry/ConstructorRegistry");
const TradeRate_1 = require("./TradeRate");
class AvailableTradeRateRegistry extends ConstructorRegistry_1.ConstructorRegistry {
    constructor() {
        super(TradeRate_1.default);
    }
}
exports.AvailableTradeRateRegistry = AvailableTradeRateRegistry;
exports.instance = new AvailableTradeRateRegistry();
exports.default = AvailableTradeRateRegistry;
//# sourceMappingURL=AvailableTradeRateRegistry.js.map