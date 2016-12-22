'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  function repository(repositoryReference) {
    return function (target) {
      OrmMetadata.forTarget(target).put('repository', repositoryReference);
    };
  }

  _export('repository', repository);

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});