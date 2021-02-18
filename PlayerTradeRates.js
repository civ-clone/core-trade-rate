"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _fudgeFactor, _player, _rates;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTradeRates = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class PlayerTradeRates extends DataObject_1.default {
    constructor(player, ...rates) {
        super();
        _fudgeFactor.set(this, 100);
        _player.set(this, void 0);
        _rates.set(this, []);
        __classPrivateFieldSet(this, _player, player);
        __classPrivateFieldSet(this, _rates, rates);
        this.addKey('all');
    }
    all() {
        return [...__classPrivateFieldGet(this, _rates)];
    }
    balance(fixed) {
        if (this.total() === 1) {
            return;
        }
        const available = 1 - fixed.value(), others = __classPrivateFieldGet(this, _rates).filter((rate) => rate !== fixed), current = others.reduce((total, rate) => total + rate.value(), 0);
        others.forEach((rate) => rate.set((rate.value() / current) * available));
        if (this.total() < 1) {
            others[Math.floor(others.length * Math.random())].add(1 - this.total());
        }
        if (this.total() > 1) {
            others[Math.floor(others.length * Math.random())].subtract(1 - this.total());
        }
    }
    get(TradeRateType) {
        const [tradeRate] = __classPrivateFieldGet(this, _rates).filter((rate) => rate instanceof TradeRateType);
        return tradeRate;
    }
    player() {
        return __classPrivateFieldGet(this, _player);
    }
    set(Type, value) {
        const rate = this.get(Type);
        rate.set(value);
        this.balance(rate);
    }
    total() {
        return (Math.round(__classPrivateFieldGet(this, _rates).reduce((total, rate) => total + rate.value(), 0) * __classPrivateFieldGet(this, _fudgeFactor)) / __classPrivateFieldGet(this, _fudgeFactor));
    }
}
exports.PlayerTradeRates = PlayerTradeRates;
_fudgeFactor = new WeakMap(), _player = new WeakMap(), _rates = new WeakMap();
exports.default = PlayerTradeRates;
//# sourceMappingURL=PlayerTradeRates.js.map