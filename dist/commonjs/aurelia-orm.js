'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRules = exports.EntityManager = exports.Entity = exports.validation = exports.validatedResource = exports.type = exports.resource = exports.repository = exports.name = exports.jsonRoot = exports.endpoint = exports.association = exports.OrmMetadata = exports.Repository = exports.DefaultRepository = exports.logger = undefined;
exports.configure = configure;

var _defaultRepository = require('./default-repository');

Object.defineProperty(exports, 'DefaultRepository', {
  enumerable: true,
  get: function get() {
    return _defaultRepository.DefaultRepository;
  }
});

var _repository = require('./repository');

Object.defineProperty(exports, 'Repository', {
  enumerable: true,
  get: function get() {
    return _repository.Repository;
  }
});

var _ormMetadata = require('./orm-metadata');

Object.defineProperty(exports, 'OrmMetadata', {
  enumerable: true,
  get: function get() {
    return _ormMetadata.OrmMetadata;
  }
});

var _association = require('./decorator/association');

Object.defineProperty(exports, 'association', {
  enumerable: true,
  get: function get() {
    return _association.association;
  }
});

var _endpoint = require('./decorator/endpoint');

Object.defineProperty(exports, 'endpoint', {
  enumerable: true,
  get: function get() {
    return _endpoint.endpoint;
  }
});

var _jsonRoot = require('./decorator/json-root');

Object.defineProperty(exports, 'jsonRoot', {
  enumerable: true,
  get: function get() {
    return _jsonRoot.jsonRoot;
  }
});

var _name = require('./decorator/name');

Object.defineProperty(exports, 'name', {
  enumerable: true,
  get: function get() {
    return _name.name;
  }
});

var _repository2 = require('./decorator/repository');

Object.defineProperty(exports, 'repository', {
  enumerable: true,
  get: function get() {
    return _repository2.repository;
  }
});

var _resource = require('./decorator/resource');

Object.defineProperty(exports, 'resource', {
  enumerable: true,
  get: function get() {
    return _resource.resource;
  }
});

var _type = require('./decorator/type');

Object.defineProperty(exports, 'type', {
  enumerable: true,
  get: function get() {
    return _type.type;
  }
});

var _validatedResource = require('./decorator/validated-resource');

Object.defineProperty(exports, 'validatedResource', {
  enumerable: true,
  get: function get() {
    return _validatedResource.validatedResource;
  }
});

var _validation = require('./decorator/validation');

Object.defineProperty(exports, 'validation', {
  enumerable: true,
  get: function get() {
    return _validation.validation;
  }
});

var _aureliaLogging = require('aurelia-logging');

var _entityManager = require('./entity-manager');

var _aureliaValidation = require('aurelia-validation');

var _entity = require('./entity');

var _associationSelect = require('./component/association-select');

var _paged = require('./component/paged');

function configure(frameworkConfig, configCallback) {
  _aureliaValidation.ValidationRules.customRule('hasAssociation', function (value) {
    return !!(value instanceof _entity.Entity && typeof value.id === 'number' || typeof value === 'number');
  }, '${$displayName} must be an association.');

  var entityManagerInstance = frameworkConfig.container.get(_entityManager.EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

var logger = exports.logger = (0, _aureliaLogging.getLogger)('aurelia-orm');

exports.Entity = _entity.Entity;
exports.EntityManager = _entityManager.EntityManager;
exports.ValidationRules = _aureliaValidation.ValidationRules;