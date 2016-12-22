'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensurePropertyIsConfigurable = ensurePropertyIsConfigurable;

var _aureliaOrm = require('../aurelia-orm');

function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
  if (descriptor && descriptor.configurable === false) {
    descriptor.configurable = true;

    if (!Reflect.defineProperty(target, propertyName, descriptor)) {
      _aureliaOrm.logger.warn('Cannot make configurable property \'' + propertyName + '\' of object', target);
    }
  }
}