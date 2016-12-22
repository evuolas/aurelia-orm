define(['exports', '../orm-metadata', './utils'], function (exports, _ormMetadata, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.association = association;
  function association(associationData) {
    return function (target, propertyName, descriptor) {
      (0, _utils.ensurePropertyIsConfigurable)(target, propertyName, descriptor);

      if (!associationData) {
        associationData = { entity: propertyName };
      } else if (typeof associationData === 'string') {
        associationData = { entity: associationData };
      }

      _ormMetadata.OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
        type: associationData.entity ? 'entity' : 'collection',
        entity: associationData.entity || associationData.collection,
        includeOnlyIds: associationData.hasOwnProperty('includeOnlyIds') ? associationData.includeOnlyIds : true,
        ignoreOnSave: associationData.hasOwnProperty('ignoreOnSave') ? associationData.ignoreOnSave : false,
        populateOnCreate: associationData.hasOwnProperty('populateOnCreate') ? associationData.populateOnCreate : true
      });
    };
  }
});