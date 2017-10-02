import { logger } from '../aurelia-orm';

export function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
  if (descriptor && descriptor.configurable === false) {
    descriptor.configurable = true;

    if (!Reflect.defineProperty(target, propertyName, descriptor)) {
      logger.warn(`Cannot make configurable property '${propertyName}' of object`, target);
    }
  }
}