System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('jsonRoot', jsonRoot);

  function jsonRoot(name) {
    return function (target) {
      OrmMetadata.forTarget(target).put('jsonRoot', name);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});