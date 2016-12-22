define(['exports', './default-repository', './repository', './orm-metadata', './decorator/association', './decorator/endpoint', './decorator/json-root', './decorator/name', './decorator/repository', './decorator/resource', './decorator/type', './decorator/validated-resource', './decorator/validation', 'aurelia-logging', './entity-manager', 'aurelia-validation', './entity', './component/association-select', './component/paged'], function (exports, _defaultRepository, _repository, _ormMetadata, _association, _endpoint, _jsonRoot, _name, _repository2, _resource, _type, _validatedResource, _validation, _aureliaLogging, _entityManager, _aureliaValidation, _entity, _associationSelect, _paged) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationRules = exports.EntityManager = exports.Entity = exports.validation = exports.validatedResource = exports.type = exports.resource = exports.repository = exports.name = exports.jsonRoot = exports.endpoint = exports.association = exports.OrmMetadata = exports.Repository = exports.DefaultRepository = exports.logger = undefined;
  exports.configure = configure;
  Object.defineProperty(exports, 'DefaultRepository', {
    enumerable: true,
    get: function () {
      return _defaultRepository.DefaultRepository;
    }
  });
  Object.defineProperty(exports, 'Repository', {
    enumerable: true,
    get: function () {
      return _repository.Repository;
    }
  });
  Object.defineProperty(exports, 'OrmMetadata', {
    enumerable: true,
    get: function () {
      return _ormMetadata.OrmMetadata;
    }
  });
  Object.defineProperty(exports, 'association', {
    enumerable: true,
    get: function () {
      return _association.association;
    }
  });
  Object.defineProperty(exports, 'endpoint', {
    enumerable: true,
    get: function () {
      return _endpoint.endpoint;
    }
  });
  Object.defineProperty(exports, 'jsonRoot', {
    enumerable: true,
    get: function () {
      return _jsonRoot.jsonRoot;
    }
  });
  Object.defineProperty(exports, 'name', {
    enumerable: true,
    get: function () {
      return _name.name;
    }
  });
  Object.defineProperty(exports, 'repository', {
    enumerable: true,
    get: function () {
      return _repository2.repository;
    }
  });
  Object.defineProperty(exports, 'resource', {
    enumerable: true,
    get: function () {
      return _resource.resource;
    }
  });
  Object.defineProperty(exports, 'type', {
    enumerable: true,
    get: function () {
      return _type.type;
    }
  });
  Object.defineProperty(exports, 'validatedResource', {
    enumerable: true,
    get: function () {
      return _validatedResource.validatedResource;
    }
  });
  Object.defineProperty(exports, 'validation', {
    enumerable: true,
    get: function () {
      return _validation.validation;
    }
  });
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
});