'use strict';

System.register(['./resource', './validation'], function (_export, _context) {
  "use strict";

  var resource, validation;
  function validatedResource(resourceName) {
    return function (target, propertyName) {
      resource(resourceName)(target);
      validation()(target, propertyName);
    };
  }

  _export('validatedResource', validatedResource);

  return {
    setters: [function (_resource) {
      resource = _resource.resource;
    }, function (_validation) {
      validation = _validation.validation;
    }],
    execute: function () {}
  };
});