'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function jsonRoot(name) {
        return function (target) {
          OrmMetadata.forTarget(target).put('jsonRoot', name);
        };
      }

      _export('jsonRoot', jsonRoot);
    }
  };
});