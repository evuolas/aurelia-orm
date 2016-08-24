'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  function endpoint(entityEndpoint) {
    return function (target) {
      OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
    };
  }

  _export('endpoint', endpoint);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});