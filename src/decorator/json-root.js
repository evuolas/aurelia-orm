import {OrmMetadata} from '../orm-metadata';

export function jsonRoot(name) {
  return function(target) {
    OrmMetadata.forTarget(target).put('jsonRoot', name);
  };
}
