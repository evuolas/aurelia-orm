'use strict';

System.register(['../orm-metadata', './utils'], function (_export, _context) {
  "use strict";

  var OrmMetadata, ensurePropertyIsConfigurable;
  function association(associationData) {
    return function (target, propertyName, descriptor) {
      ensurePropertyIsConfigurable(target, propertyName, descriptor);

      if (!associationData) {
        associationData = { entity: propertyName };
      } else if (typeof associationData === 'string') {
        associationData = { entity: associationData };
      }

      OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
        type: associationData.entity ? 'entity' : 'collection',
        entity: associationData.entity || associationData.collection,
        includeOnlyIds: associationData.hasOwnProperty('includeOnlyIds') ? associationData.includeOnlyIds : true,
        ignoreOnSave: associationData.hasOwnProperty('ignoreOnSave') ? associationData.ignoreOnSave : false,
        populateOnCreate: associationData.hasOwnProperty('populateOnCreate') ? associationData.populateOnCreate : true
      });
    };
  }

  _export('association', association);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }, function (_utils) {
      ensurePropertyIsConfigurable = _utils.ensurePropertyIsConfigurable;
    }],
    execute: function () {}
  };
});