'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityManager = undefined;

var _dec, _class;

var _entity = require('./entity');

var _defaultRepository = require('./default-repository');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _ormMetadata = require('./orm-metadata');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntityManager = exports.EntityManager = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.Container), _dec(_class = function () {
  function EntityManager(container) {
    _classCallCheck(this, EntityManager);

    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  EntityManager.prototype.registerEntities = function registerEntities(EntityClasses) {
    for (var property in EntityClasses) {
      if (EntityClasses.hasOwnProperty(property)) {
        this.registerEntity(EntityClasses[property]);
      }
    }

    return this;
  };

  EntityManager.prototype.registerEntity = function registerEntity(EntityClass) {
    this.entities[_ormMetadata.OrmMetadata.forTarget(EntityClass).fetch('resource')] = EntityClass;

    return this;
  };

  EntityManager.prototype.getRepository = function getRepository(entity) {
    var reference = this.resolveEntityReference(entity);
    var resource = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    if (this.repositories[resource]) {
      return this.repositories[resource];
    }

    var metaData = _ormMetadata.OrmMetadata.forTarget(reference);
    var repository = metaData.fetch('repository');
    var instance = this.container.get(repository);

    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    instance.setMeta(metaData);
    instance.resource = resource;
    instance.entityManager = this;

    if (instance instanceof _defaultRepository.DefaultRepository) {
      this.repositories[resource] = instance;
    }

    return instance;
  };

  EntityManager.prototype.resolveEntityReference = function resolveEntityReference(resource) {
    var entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || _entity.Entity;
    }

    if (typeof entityReference === 'function') {
      return entityReference;
    }

    throw new Error('Unable to resolve to entity reference. Expected string or function.');
  };

  EntityManager.prototype.getEntity = function getEntity(entity) {
    var reference = this.resolveEntityReference(entity);
    var instance = this.container.get(reference);
    var resource = reference.getResource();

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
    }

    if (instance.hasValidation() && !instance.getValidator()) {
      var validator = this.container.get(_ormMetadata.OrmMetadata.forTarget(reference).fetch('validation'));

      instance.setValidator(validator);
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  };

  return EntityManager;
}()) || _class);