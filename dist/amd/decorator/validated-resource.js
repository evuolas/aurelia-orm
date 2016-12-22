define(['exports', './resource', './validation'], function (exports, _resource, _validation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validatedResource = validatedResource;
  function validatedResource(resourceName, ValidatorClass) {
    return function (target, propertyName) {
      (0, _resource.resource)(resourceName)(target);
      (0, _validation.validation)(ValidatorClass)(target, propertyName);
    };
  }
});