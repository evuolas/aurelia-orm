'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  function resource(resourceName) {
    return function (target) {
      OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
    };
  }

  _export('resource', resource);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});