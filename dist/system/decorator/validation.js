'use strict';

System.register(['../orm-metadata', 'aurelia-validation'], function (_export, _context) {
  "use strict";

  var OrmMetadata, Validator;
  function validation() {
    var ValidatorClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Validator;

    return function (target) {
      OrmMetadata.forTarget(target).put('validation', ValidatorClass);
    };
  }

  _export('validation', validation);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }, function (_aureliaValidation) {
      Validator = _aureliaValidation.Validator;
    }],
    execute: function () {}
  };
});