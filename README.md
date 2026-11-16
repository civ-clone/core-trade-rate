# core-trade-rate

This package contains the basics for managing the concept of a `TradeRate` like in the original Civilization.

## Maximum rates

A rule set may limit how much of their trade a player puts into each rate:

- `MaxRate(player, rate)` answers the most, as a fraction from 0 to 1, or `undefined` for no limit. The lowest answer
  holds. With no `MaxRate` rules there is no limit, and setting rates works exactly as it did.
- `ExcessRate(player, rate)` answers where what a rate has over its maximum goes: the rates to move it to, in order,
  each taking what it can up to its own maximum. With no answer it goes to the other rates in the player's order.

`PlayerTradeRates#set` sets a rate no higher than its maximum, and `setAll` takes any rates that come to 100 and
reshapes them to the maximums, so neither refuses rates a maximum changes. `enforceMaxRates()` does the same for rates
that are already over, for example after a change of government. `maxRate(Type)`, `maxRates()` and the `maxRates(player)`
helper answer the maximums, for showing them.

`PlayerTradeRates` takes the rule registry among its constructor's arguments, as it takes the random number generator.
Without one it asks the default registry.
