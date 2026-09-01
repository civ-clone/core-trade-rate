"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTradeRates = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class PlayerTradeRates extends DataObject_1.DataObject {
    constructor(player, ...rates) {
        super();
        this._rates = [];
        this._player = player;
        this._rates = rates;
        this.addKey('all');
    }
    all() {
        return [...this._rates];
    }
    balance(fixed) {
        if (this.total() === 100) {
            return;
        }
        const available = 100 - fixed.value(), others = this._rates.filter((rate) => rate !== fixed), current = others.reduce((total, rate) => total + rate.value(), 0);
        others.forEach((rate) => rate.set((rate.value() / current) * available));
        if (this.total() < 100) {
            others[Math.floor(others.length * Math.random())].add(100 - this.total());
        }
        if (this.total() > 100) {
            others[Math.floor(others.length * Math.random())].subtract(100 - this.total());
        }
    }
    get(TradeRateType) {
        const [tradeRate] = this._rates.filter((rate) => rate instanceof TradeRateType);
        return tradeRate;
    }
    player() {
        return this._player;
    }
    set(Type, value) {
        const rate = this.get(Type);
        rate.set(value);
        this.balance(rate);
    }
    setAll(ratesAndValues) {
        if (ratesAndValues.reduce((total, [, value]) => total + value, 0) !==
            100) {
            throw new TypeError(`Invalid rates provided, must sum to 100.`);
        }
        ratesAndValues.forEach(([Type, value]) => this.get(Type).set(value));
    }
    total() {
        return this._rates.reduce((total, rate) => total + rate.value(), 0);
    }
}
exports.PlayerTradeRates = PlayerTradeRates;
exports.default = PlayerTradeRates;
//# sourceMappingURL=PlayerTradeRates.js.map