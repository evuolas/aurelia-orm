define(['exports', './default-repository', './repository', './entity', './orm-metadata', './entity-manager', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/json-root', './decorator/validation', './decorator/type', './decorator/validated-resource', 'aurelia-validation', './validator/has-association'], function (exports, _defaultRepository, _repository, _entity, _ormMetadata, _entityManager, _association, _resource, _endpoint, _name, _repository2, _jsonRoot, _validation, _type, _validatedResource, _aureliaValidation, _hasAssociation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validatedResource = exports.type = exports.validation = exports.jsonRoot = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.EntityManager = exports.OrmMetadata = exports.Entity = exports.Repository = exports.DefaultRepository = undefined;
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
  Object.defineProperty(exports, 'Entity', {
    enumerable: true,
    get: function () {
      return _entity.Entity;
    }
  });
  Object.defineProperty(exports, 'OrmMetadata', {
    enumerable: true,
    get: function () {
      return _ormMetadata.OrmMetadata;
    }
  });
  Object.defineProperty(exports, 'EntityManager', {
    enumerable: true,
    get: function () {
      return _entityManager.EntityManager;
    }
  });
  Object.defineProperty(exports, 'association', {
    enumerable: true,
    get: function () {
      return _association.association;
    }
  });
  Object.defineProperty(exports, 'resource', {
    enumerable: true,
    get: function () {
      return _resource.resource;
    }
  });
  Object.defineProperty(exports, 'endpoint', {
    enumerable: true,
    get: function () {
      return _endpoint.endpoint;
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
  Object.defineProperty(exports, 'jsonRoot', {
    enumerable: true,
    get: function () {
      return _jsonRoot.jsonRoot;
    }
  });
  Object.defineProperty(exports, 'validation', {
    enumerable: true,
    get: function () {
      return _validation.validation;
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
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(_entityManager.EntityManager);

    configCallback(entityManagerInstance);

    _aureliaValidation.ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new _hasAssociation.HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
  }
});