# core-trade-rate

This package contains the basics for managing the concept of a `TradeRate` like in the original Civilization.

## Maximum rates

A rule set may limit how much of their trade a player puts into each rate:

- `MaxRate(player, rate)` answers the most, as a fraction from 0 to 1, or `undefined` for no limit. The lowest answer
  holds. With no `MaxRate` rules there is no limit, and setting rates works exactly as it did.
- `ExcessRate(player, rate)` answers where what a rate has over its maximum goes: the rates to move it to, in order,
  each taking what it can up to its own maximum. When those are full, any other rate the answer left out takes what's
  left, in the player's order; with no answer it goes to the other rates in the player's order. What no rate can take
  stays on the rate, as the maximums then leave no way to make 100.

`PlayerTradeRates#set` sets a rate no higher than its maximum (and the rate it sets takes any excess last, so a cap
doesn't move the change straight back), and `setAll` takes any rates that come to 100 and
reshapes them to the maximums, so neither refuses rates a maximum changes. `enforceMaxRates()` does the same for rates
that are already over, for example after a change of government. `maxRate(Type)`, `maxRates()` and the `maxRates(player)`
helper answer the maximums, for showing them.

`PlayerTradeRates` takes the rule registry among its constructor's arguments, as it takes the random number generator.
**A rule set must pass its game's own `RuleRegistry` there.** Without one, a new game's rates ask the default (global)
registry, while a loaded game's are given the game's rules (`Game.inject`), so a game whose rules aren't the global
registry would see its maximums only after a reload.

When the other rates have nothing in them, `set` shares what's left evenly between them (it used to make them `NaN`).
