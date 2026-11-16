"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTradeRates = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const ExcessRate_1 = require("./Rules/ExcessRate");
const MaxRate_1 = require("./Rules/MaxRate");
const core_random_1 = require("@civ-clone/core-random");
class PlayerTradeRates extends DataObject_1.DataObject {
    // The generator arrives among the variadic arguments, discriminated by type,
    // rather than as a parameter of its own. A rest parameter cannot be followed
    // by another, and inserting one ahead of it would break every existing call
    // — the change has to stay range-compatible within `0.1.x`. This is the
    // pattern `core-diplomacy`'s `Interaction` already uses. The rule registry, which says the most each rate may be
    // (`MaxRate`), arrives the same way.
    constructor(player, ...rates) {
        super();
        this._randomNumberGenerator = core_random_1.instance;
        this._rates = [];
        this._ruleRegistry = RuleRegistry_1.instance;
        this._player = player;
        rates.forEach((rate) => {
            if (typeof rate === 'function') {
                this._randomNumberGenerator = rate;
                return;
            }
            if (rate instanceof RuleRegistry_1.RuleRegistry) {
                this._ruleRegistry = rate;
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
    /**
     * Brings any rate over its maximum (`MaxRate`) down to it, and moves what it had over to the rates `ExcessRate`
     *  says, in order, each taking what it can up to its own maximum. Rates are seen to in the player's order. What none
     *  can take stays where it was, as the maximums then leave no way to make 100. Answers whether anything moved.
     *
     * With no `MaxRate` rules, nothing is ever over, and nothing is asked.
     */
    enforceMaxRates() {
        if (this._ruleRegistry.get(MaxRate_1.default).length === 0) {
            return false;
        }
        const maximums = new Map(), maximumOf = (rate) => { var _a; return (_a = maximums.get(rate)) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY; };
        this._rates.forEach((rate) => {
            const maximum = this.maxRate(rate.sourceClass());
            if (maximum !== undefined) {
                // In whole hundredths and their fractions, so 0.7 is 70 and not 70.00000000000001.
                maximums.set(rate, Math.round(maximum * 1e6) / 1e4);
            }
        });
        let changed = false;
        this._rates.forEach((rate) => {
            const maximum = maximumOf(rate);
            if (rate.value() <= maximum) {
                return;
            }
            let excess = rate.value() - maximum;
            rate.set(maximum);
            changed = true;
            this.excessTo(rate).forEach((recipient) => {
                const room = maximumOf(recipient) - recipient.value();
                if (excess <= 0 || room <= 0) {
                    return;
                }
                const moved = Math.min(room, excess);
                recipient.set(recipient.value() + moved);
                excess -= moved;
            });
            if (excess > 0) {
                rate.set(rate.value() + excess);
            }
        });
        return changed;
    }
    get(TradeRateType) {
        const [tradeRate] = this._rates.filter((rate) => rate instanceof TradeRateType);
        return tradeRate;
    }
    /**
     * The most the player may put into `Type`, as a fraction of their trade from 0 to 1: the lowest of the `MaxRate`
     *  rules' answers, or `undefined` when none gives one.
     */
    maxRate(Type) {
        const rate = this.get(Type);
        if (rate === undefined) {
            return undefined;
        }
        return this._ruleRegistry
            .process(MaxRate_1.default, this._player, rate)
            .filter((maximum) => typeof maximum === 'number' && Number.isFinite(maximum))
            .reduce((lowest, maximum) => Math.max(0, Math.min(1, lowest !== null && lowest !== void 0 ? lowest : 1, maximum)), undefined);
    }
    /**
     * Each of the player's rates, with the most they may put into it (`maxRate`).
     */
    maxRates() {
        return this._rates.map((rate) => [
            rate,
            this.maxRate(rate.sourceClass()),
        ]);
    }
    player() {
        return this._player;
    }
    /**
     * Sets one rate, no higher than its maximum, and shares what's left between the others as they were.
     */
    set(Type, value) {
        const rate = this.get(Type), maximum = this.maxRate(Type);
        rate.set(maximum === undefined
            ? value
            : Math.min(value, Math.round(maximum * 1e6) / 1e4));
        this.balance(rate);
        this.enforceMaxRates();
    }
    setAll(ratesAndValues) {
        if (ratesAndValues.reduce((total, [, value]) => total + value, 0) !==
            100) {
            throw new TypeError(`Invalid rates provided, must sum to 100.`);
        }
        ratesAndValues.forEach(([Type, value]) => this.get(Type).set(value));
        // Rates that come to 100 are always taken, and reshaped to the maximums.
        this.enforceMaxRates();
    }
    // Where the excess over `rate`'s maximum goes (`ExcessRate`): the first answer, or the other rates in order.
    excessTo(rate) {
        const [order] = this._ruleRegistry
            .process(ExcessRate_1.default, this._player, rate)
            .filter((answer) => Array.isArray(answer));
        if (order === undefined) {
            return this._rates.filter((other) => other !== rate);
        }
        return order
            .map((Type) => this.get(Type))
            .filter((other) => other !== undefined && other !== rate);
    }
    total() {
        return this._rates.reduce((total, rate) => total + rate.value(), 0);
    }
}
exports.PlayerTradeRates = PlayerTradeRates;
PlayerTradeRates.transient = ['_randomNumberGenerator', '_ruleRegistry'];
exports.default = PlayerTradeRates;
//# sourceMappingURL=PlayerTradeRates.js.map