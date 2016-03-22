<<<<<<< HEAD
System.register(['./entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/json-root', './decorator/validation', './decorator/validated-resource'], function (_export) {
=======
System.register(['./entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource'], function (_export) {
>>>>>>> SpoonX/master
  'use strict';

  var EntityManager, ValidationGroup, HasAssociationValidationRule;

  _export('configure', configure);

  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(EntityManager);

    configCallback(entityManagerInstance);

    ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
  }

  return {
    setters: [function (_entityManager) {
      EntityManager = _entityManager.EntityManager;

      _export('EntityManager', _entityManager.EntityManager);
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_validatorHasAssociation) {
      HasAssociationValidationRule = _validatorHasAssociation.HasAssociationValidationRule;
    }, function (_defaultRepository) {
      _export('DefaultRepository', _defaultRepository.DefaultRepository);
    }, function (_repository) {
      _export('Repository', _repository.Repository);
    }, function (_entity) {
      _export('Entity', _entity.Entity);
    }, function (_ormMetadata) {
      _export('OrmMetadata', _ormMetadata.OrmMetadata);
    }, function (_decoratorAssociation) {
      _export('association', _decoratorAssociation.association);
    }, function (_decoratorResource) {
      _export('resource', _decoratorResource.resource);
    }, function (_decoratorEndpoint) {
      _export('endpoint', _decoratorEndpoint.endpoint);
    }, function (_decoratorName) {
      _export('name', _decoratorName.name);
    }, function (_decoratorRepository) {
      _export('repository', _decoratorRepository.repository);
    }, function (_decoratorJsonRoot) {
      _export('jsonRoot', _decoratorJsonRoot.jsonRoot);
    }, function (_decoratorValidation) {
      _export('validation', _decoratorValidation.validation);
    }, function (_decoratorType) {
      _export('type', _decoratorType.type);
    }, function (_decoratorValidatedResource) {
      _export('validatedResource', _decoratorValidatedResource.validatedResource);
    }],
    execute: function () {}
  };
});