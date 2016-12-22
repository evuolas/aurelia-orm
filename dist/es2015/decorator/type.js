import { OrmMetadata } from '../orm-metadata';
import { ensurePropertyIsConfigurable } from './utils';

export function type(typeValue) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}