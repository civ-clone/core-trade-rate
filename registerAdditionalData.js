"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdditionalDataRegistry_1 = require("@civ-clone/core-data-object/AdditionalDataRegistry");
const rates_1 = require("./AdditionalData/rates");
AdditionalDataRegistry_1.instance.register(...(0, rates_1.default)());
//# sourceMappingURL=registerAdditionalData.js.map