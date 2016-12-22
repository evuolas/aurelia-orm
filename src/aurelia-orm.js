import {getLogger} from 'aurelia-logging';
import {EntityManager} from './entity-manager';
import {ValidationRules} from 'aurelia-validation';
import {Entity} from './entity';

// added for bundling
import {AssociationSelect} from './component/association-select'; // eslint-disable-line no-unused-vars
import {Paged} from './component/paged'; // eslint-disable-line no-unused-vars

/**
 * Plugin configure
 *
 * @export
 * @param {*} frameworkConfig
 * @param {*} configCallback
 */
export function configure(frameworkConfig, configCallback) {
  // add hasAssociation custom validation rule
  ValidationRules.customRule(
    'hasAssociation',
    value => !!((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number'),
    `\${$displayName} must be an association.`    // eslint-disable-line quotes
  );

  let entityManagerInstance = frameworkConfig.container.get(EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');

export {DefaultRepository} from './default-repository';
export {Repository} from './repository';
export {OrmMetadata} from './orm-metadata';

export {association} from './decorator/association';
export {endpoint} from './decorator/endpoint';
export {jsonRoot} from './decorator/json-root';
export {name} from './decorator/name';
export {repository} from './decorator/repository';
export {resource} from './decorator/resource';
export {type} from './decorator/type';
export {validatedResource} from './decorator/validated-resource';
export {validation} from './decorator/validation';

export {Entity, EntityManager, ValidationRules};
