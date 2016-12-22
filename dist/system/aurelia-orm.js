'use strict';

System.register(['aurelia-logging', './entity-manager', 'aurelia-validation', './entity', './component/association-select', './component/paged', './default-repository', './repository', './orm-metadata', './decorator/association', './decorator/endpoint', './decorator/json-root', './decorator/name', './decorator/repository', './decorator/resource', './decorator/type', './decorator/validated-resource', './decorator/validation'], function (_export, _context) {
  "use strict";

  var getLogger, EntityManager, ValidationRules, Entity, AssociationSelect, Paged, logger;
  function configure(frameworkConfig, configCallback) {
    ValidationRules.customRule('hasAssociation', function (value) {
      return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
    }, '${$displayName} must be an association.');

    var entityManagerInstance = frameworkConfig.container.get(EntityManager);

    configCallback(entityManagerInstance);

    frameworkConfig.globalResources('./component/association-select');
    frameworkConfig.globalResources('./component/paged');
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaLogging) {
      getLogger = _aureliaLogging.getLogger;
    }, function (_entityManager) {
      EntityManager = _entityManager.EntityManager;
    }, function (_aureliaValidation) {
      ValidationRules = _aureliaValidation.ValidationRules;
    }, function (_entity) {
      Entity = _entity.Entity;
    }, function (_componentAssociationSelect) {
      AssociationSelect = _componentAssociationSelect.AssociationSelect;
    }, function (_componentPaged) {
      Paged = _componentPaged.Paged;
    }, function (_defaultRepository) {
      var _exportObj = {};
      _exportObj.DefaultRepository = _defaultRepository.DefaultRepository;

      _export(_exportObj);
    }, function (_repository) {
      var _exportObj2 = {};
      _exportObj2.Repository = _repository.Repository;

      _export(_exportObj2);
    }, function (_ormMetadata) {
      var _exportObj3 = {};
      _exportObj3.OrmMetadata = _ormMetadata.OrmMetadata;

      _export(_exportObj3);
    }, function (_decoratorAssociation) {
      var _exportObj4 = {};
      _exportObj4.association = _decoratorAssociation.association;

      _export(_exportObj4);
    }, function (_decoratorEndpoint) {
      var _exportObj5 = {};
      _exportObj5.endpoint = _decoratorEndpoint.endpoint;

      _export(_exportObj5);
    }, function (_decoratorJsonRoot) {
      var _exportObj6 = {};
      _exportObj6.jsonRoot = _decoratorJsonRoot.jsonRoot;

      _export(_exportObj6);
    }, function (_decoratorName) {
      var _exportObj7 = {};
      _exportObj7.name = _decoratorName.name;

      _export(_exportObj7);
    }, function (_decoratorRepository) {
      var _exportObj8 = {};
      _exportObj8.repository = _decoratorRepository.repository;

      _export(_exportObj8);
    }, function (_decoratorResource) {
      var _exportObj9 = {};
      _exportObj9.resource = _decoratorResource.resource;

      _export(_exportObj9);
    }, function (_decoratorType) {
      var _exportObj10 = {};
      _exportObj10.type = _decoratorType.type;

      _export(_exportObj10);
    }, function (_decoratorValidatedResource) {
      var _exportObj11 = {};
      _exportObj11.validatedResource = _decoratorValidatedResource.validatedResource;

      _export(_exportObj11);
    }, function (_decoratorValidation) {
      var _exportObj12 = {};
      _exportObj12.validation = _decoratorValidation.validation;

      _export(_exportObj12);
    }],
    execute: function () {
      _export('logger', logger = getLogger('aurelia-orm'));

      _export('logger', logger);

      _export('Entity', Entity);

      _export('EntityManager', EntityManager);

      _export('ValidationRules', ValidationRules);
    }
  };
});