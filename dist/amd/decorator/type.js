define(['exports', '../orm-metadata', './utils'], function (exports, _ormMetadata, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.type = type;
  function type(typeValue) {
    return function (target, propertyName, descriptor) {
      (0, _utils.ensurePropertyIsConfigurable)(target, propertyName, descriptor);

      _ormMetadata.OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
    };
  }
});