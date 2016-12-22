'use strict';

System.register(['../orm-metadata', './utils'], function (_export, _context) {
  "use strict";

  var OrmMetadata, ensurePropertyIsConfigurable;
  function type(typeValue) {
    return function (target, propertyName, descriptor) {
      ensurePropertyIsConfigurable(target, propertyName, descriptor);

      OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
    };
  }

  _export('type', type);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }, function (_utils) {
      ensurePropertyIsConfigurable = _utils.ensurePropertyIsConfigurable;
    }],
    execute: function () {}
  };
});