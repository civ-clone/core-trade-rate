"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTradeRates = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const core_random_1 = require("@civ-clone/core-random");
class PlayerTradeRates extends DataObject_1.DataObject {
    // The generator arrives among the variadic arguments, discriminated by type,
    // rather than as a parameter of its own. A rest parameter cannot be followed
    // by another, and inserting one ahead of it would break every existing call
    // — the change has to stay range-compatible within `0.1.x`. This is the
    // pattern `core-diplomacy`'s `Interaction` already uses.
    constructor(player, ...rates) {
        super();
        this._randomNumberGenerator = core_random_1.instance;
        this._rates = [];
        this._player = player;
        rates.forEach((rate) => {
            if (typeof rate === 'function') {
                this._randomNumberGenerator = rate;
                return;
            }
            this._rates.push(rate);
        });
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
            others[Math.floor(others.length * this._randomNumberGenerator())].add(100 - this.total());
        }
        if (this.total() > 100) {
            others[Math.floor(others.length * this._randomNumberGenerator())].subtract(100 - this.total());
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
PlayerTradeRates.transient = ['_randomNumberGenerator'];
exports.default = PlayerTradeRates;
//# sourceMappingURL=PlayerTradeRates.js.map