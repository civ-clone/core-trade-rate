import { instance as additionalDataRegistryInstance } from '@civ-clone/core-data-object/AdditionalDataRegistry';
import rates from './AdditionalData/rates';

additionalDataRegistryInstance.register(...rates());
