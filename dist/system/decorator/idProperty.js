'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  function idProperty(propertyName) {
    return function (target) {
      OrmMetadata.forTarget(target).put('idProperty', propertyName);
    };
  }

  _export('idProperty', idProperty);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});