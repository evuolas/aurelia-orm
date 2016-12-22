define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.jsonRoot = jsonRoot;
  function jsonRoot(name) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('jsonRoot', name);
    };
  }
});