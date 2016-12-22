'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;

var _ormMetadata = require('../orm-metadata');

var _utils = require('./utils');

function type(typeValue) {
  return function (target, propertyName, descriptor) {
    (0, _utils.ensurePropertyIsConfigurable)(target, propertyName, descriptor);

    _ormMetadata.OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}