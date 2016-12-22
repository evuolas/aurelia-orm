'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validation = validation;

var _ormMetadata = require('../orm-metadata');

var _aureliaValidation = require('aurelia-validation');

function validation() {
  var ValidatorClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _aureliaValidation.Validator;

  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}