'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonRoot = jsonRoot;

var _ormMetadata = require('../orm-metadata');

function jsonRoot(name) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('jsonRoot', name);
  };
}