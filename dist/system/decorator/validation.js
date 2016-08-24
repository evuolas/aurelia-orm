'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  function validation() {
    return function (target) {
      OrmMetadata.forTarget(target).put('validation', true);
    };
  }

  _export('validation', validation);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});