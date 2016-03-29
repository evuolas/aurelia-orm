'use strict';

System.register(['./entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/json-root', './decorator/validation', './decorator/type', './decorator/validated-resource'], function (_export, _context) {
  var EntityManager, ValidationGroup, HasAssociationValidationRule;
  return {
    setters: [function (_entityManager) {
      EntityManager = _entityManager.EntityManager;
      var _exportObj = {};
      _exportObj.EntityManager = _entityManager.EntityManager;

      _export(_exportObj);
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_validatorHasAssociation) {
      HasAssociationValidationRule = _validatorHasAssociation.HasAssociationValidationRule;
    }, function (_defaultRepository) {
      var _exportObj2 = {};
      _exportObj2.DefaultRepository = _defaultRepository.DefaultRepository;

      _export(_exportObj2);
    }, function (_repository) {
      var _exportObj3 = {};
      _exportObj3.Repository = _repository.Repository;

      _export(_exportObj3);
    }, function (_entity) {
      var _exportObj4 = {};
      _exportObj4.Entity = _entity.Entity;

      _export(_exportObj4);
    }, function (_ormMetadata) {
      var _exportObj5 = {};
      _exportObj5.OrmMetadata = _ormMetadata.OrmMetadata;

      _export(_exportObj5);
    }, function (_decoratorAssociation) {
      var _exportObj6 = {};
      _exportObj6.association = _decoratorAssociation.association;

      _export(_exportObj6);
    }, function (_decoratorResource) {
      var _exportObj7 = {};
      _exportObj7.resource = _decoratorResource.resource;

      _export(_exportObj7);
    }, function (_decoratorEndpoint) {
      var _exportObj8 = {};
      _exportObj8.endpoint = _decoratorEndpoint.endpoint;

      _export(_exportObj8);
    }, function (_decoratorName) {
      var _exportObj9 = {};
      _exportObj9.name = _decoratorName.name;

      _export(_exportObj9);
    }, function (_decoratorRepository) {
      var _exportObj10 = {};
      _exportObj10.repository = _decoratorRepository.repository;

      _export(_exportObj10);
    }, function (_decoratorJsonRoot) {
      var _exportObj11 = {};
      _exportObj11.jsonRoot = _decoratorJsonRoot.jsonRoot;

      _export(_exportObj11);
    }, function (_decoratorValidation) {
      var _exportObj12 = {};
      _exportObj12.validation = _decoratorValidation.validation;

      _export(_exportObj12);
    }, function (_decoratorType) {
      var _exportObj13 = {};
      _exportObj13.type = _decoratorType.type;

      _export(_exportObj13);
    }, function (_decoratorValidatedResource) {
      var _exportObj14 = {};
      _exportObj14.validatedResource = _decoratorValidatedResource.validatedResource;

      _export(_exportObj14);
    }],
    execute: function () {
      function configure(aurelia, configCallback) {
        var entityManagerInstance = aurelia.container.get(EntityManager);

        configCallback(entityManagerInstance);

        ValidationGroup.prototype.hasAssociation = function () {
          return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
        };

        aurelia.globalResources('./component/association-select');
      }

      _export('configure', configure);
    }
  };
});