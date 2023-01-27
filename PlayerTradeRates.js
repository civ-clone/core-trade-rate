"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PlayerTradeRates_player, _PlayerTradeRates_rates;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTradeRates = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class PlayerTradeRates extends DataObject_1.DataObject {
    constructor(player, ...rates) {
        super();
        _PlayerTradeRates_player.set(this, void 0);
        _PlayerTradeRates_rates.set(this, []);
        __classPrivateFieldSet(this, _PlayerTradeRates_player, player, "f");
        __classPrivateFieldSet(this, _PlayerTradeRates_rates, rates, "f");
        this.addKey('all');
    }
    all() {
        return [...__classPrivateFieldGet(this, _PlayerTradeRates_rates, "f")];
    }
    balance(fixed) {
        if (this.total() === 100) {
            return;
        }
        const available = 100 - fixed.value(), others = __classPrivateFieldGet(this, _PlayerTradeRates_rates, "f").filter((rate) => rate !== fixed), current = others.reduce((total, rate) => total + rate.value(), 0);
        others.forEach((rate) => rate.set((rate.value() / current) * available));
        if (this.total() < 100) {
            others[Math.floor(others.length * Math.random())].add(100 - this.total());
        }
        if (this.total() > 100) {
            others[Math.floor(others.length * Math.random())].subtract(100 - this.total());
        }
    }
    get(TradeRateType) {
        const [tradeRate] = __classPrivateFieldGet(this, _PlayerTradeRates_rates, "f").filter((rate) => rate instanceof TradeRateType);
        return tradeRate;
    }
    player() {
        return __classPrivateFieldGet(this, _PlayerTradeRates_player, "f");
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
        return __classPrivateFieldGet(this, _PlayerTradeRates_rates, "f").reduce((total, rate) => total + rate.value(), 0);
    }
}
exports.PlayerTradeRates = PlayerTradeRates;
_PlayerTradeRates_player = new WeakMap(), _PlayerTradeRates_rates = new WeakMap();
exports.default = PlayerTradeRates;
//# sourceMappingURL=PlayerTradeRates.js.map