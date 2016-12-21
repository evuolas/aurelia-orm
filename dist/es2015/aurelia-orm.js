var _dec, _class, _dec2, _class2, _dec3, _class4, _class5, _temp, _dec4, _class6, _dec5, _dec6, _dec7, _dec8, _class8, _desc, _value, _class9, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _dec9, _dec10, _dec11, _dec12, _class11, _desc2, _value2, _class12, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import typer from 'typer';
import getProp from 'get-prop';
import { getLogger } from 'aurelia-logging';
import { ValidationRules, Validator } from 'aurelia-validation';
import { transient, Container, inject } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { Config } from 'aurelia-api';
import { bindingMode, BindingEngine } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';

export function configure(frameworkConfig, configCallback) {
  ValidationRules.customRule('hasAssociation', value => !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number'), `\${$displayName} must be an association.`);

  let entityManagerInstance = frameworkConfig.container.get(EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');

export let DefaultRepository = (_dec = transient(), _dec(_class = class DefaultRepository extends Repository {}) || _class);

export let EntityManager = (_dec2 = inject(Container), _dec2(_class2 = class EntityManager {
  constructor(container) {
    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  registerEntities(EntityClasses) {
    for (let property in EntityClasses) {
      if (EntityClasses.hasOwnProperty(property)) {
        this.registerEntity(EntityClasses[property]);
      }
    }

    return this;
  }

  registerEntity(EntityClass) {
    this.entities[OrmMetadata.forTarget(EntityClass).fetch('resource')] = EntityClass;

    return this;
  }

  getRepository(entity) {
    let reference = this.resolveEntityReference(entity);
    let resource = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    if (this.repositories[resource]) {
      return this.repositories[resource];
    }

    let metaData = OrmMetadata.forTarget(reference);
    let repository = metaData.fetch('repository');
    let instance = this.container.get(repository);

    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    instance.setMeta(metaData);
    instance.resource = resource;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      this.repositories[resource] = instance;
    }

    return instance;
  }

  resolveEntityReference(resource) {
    let entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || Entity;
    }

    if (typeof entityReference === 'function') {
      return entityReference;
    }

    throw new Error('Unable to resolve to entity reference. Expected string or function.');
  }

  getEntity(entity) {
    let reference = this.resolveEntityReference(entity);
    let instance = this.container.get(reference);
    let resource = reference.getResource();

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
    }

    if (instance.hasValidation() && !instance.getValidator()) {
      let validator = this.container.get(OrmMetadata.forTarget(reference).fetch('validation'));

      instance.setValidator(validator);
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  }
}) || _class2);

export let Entity = (_dec3 = transient(), _dec3(_class4 = class Entity {
  constructor() {
    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);
  }

  getTransport() {
    return this.getRepository().getTransport();
  }

  getRepository() {
    return this.__repository;
  }

  setRepository(repository) {
    return this.define('__repository', repository);
  }

  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  getMeta() {
    return this.__meta;
  }

  getIdProperty() {
    return this.getMeta().fetch('idProperty');
  }

  static getIdProperty() {
    let idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

    return idProperty;
  }

  getId() {
    return this[this.getIdProperty()];
  }

  setId(id) {
    this[this.getIdProperty()] = id;

    return this;
  }

  save(path, options) {
    if (!this.isNew()) {
      return this.update(path, options);
    }

    let repository = this.getRepository();
    let requestBody = this.asObject(true);
    let response;

    const rootObject = repository.enableRootObjects;

    if (rootObject) {
      let bodyWithRoot = {};

      bodyWithRoot[repository.jsonRootObjectSingle] = requestBody;
      requestBody = bodyWithRoot;
    }

    if (!path) {
      path = this.getResource();
    }

    return this.getTransport().create(path, requestBody, options).then(created => {
      const data = rootObject ? created[repository.jsonRootObjectSingle] : created;

      this.setId(data[this.getIdProperty()]);
      response = data;
    }).then(() => this.markClean()).then(() => response);
  }

  update(path, options) {
    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return Promise.resolve(null);
    }

    let repository = this.getRepository();
    let requestBody = this.asObject(true);
    let response;

    const rootObject = repository.enableRootObjects;

    if (rootObject) {
      let bodyWithRoot = {};

      bodyWithRoot[repository.jsonRootObjectSingle] = requestBody;
      requestBody = bodyWithRoot;
    }

    delete requestBody[this.getIdProperty()];

    if (!path) {
      path = this.getResource();
    }

    return this.getTransport().update(path, this.getId(), requestBody, options).then(updated => {
      const data = rootObject ? updated[repository.jsonRootObjectSingle] : updated;

      response = data;
    }).then(() => this.markClean()).then(() => response);
  }

  addCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let url = [this.getResource(), this.getId(), property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      let associationProperty = getPropertyForAssociation(entity, this);
      let relation = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        return entity.save().then(() => {
          if (entity.isNew()) {
            throw new Error('Entity did not return return an id on saving.');
          }

          return this.addCollectionAssociation(entity, property);
        });
      }

      entity[associationProperty] = this.getId();

      return entity.save().then(() => entity);
    }

    url.push(entity.getId());

    return this.getTransport().create(url.join('/')).then(() => entity);
  }

  removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.getId()) {
        return Promise.resolve(null);
      }

      idToRemove = entity.getId();
    }

    return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
  }

  saveCollections() {
    let tasks = [];
    let currentCollections = getCollectionsCompact(this, true);
    let cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    let addTasksForDifferences = (base, candidate, method) => {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(property => {
        base[property].forEach(id => {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(this, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(results => this);
  }

  markClean() {
    let cleanValues = getFlat(this);

    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  }

  isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  }

  isDirty() {
    return !this.isClean();
  }

  isNew() {
    return !this.getId();
  }

  reset(shallow) {
    let pojo = {};
    let metadata = this.getMeta();

    Object.keys(this).forEach(propertyName => {
      let value = this[propertyName];
      let association = metadata.fetch('associations', propertyName);

      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }
    });

    if (this.isClean()) {
      return this;
    }

    let isNew = this.isNew();
    let associations = this.getMeta().fetch('associations');

    Object.keys(this).forEach(propertyName => {
      if (Object.getOwnPropertyNames(associations).indexOf(propertyName) === -1) {
        delete this[propertyName];
      }
    });

    if (isNew) {
      return this.markClean();
    }

    this.setData(this.__cleanValues.data.entity);

    if (shallow) {
      return this.markClean();
    }

    let collections = this.__cleanValues.data.collections;

    Object.getOwnPropertyNames(collections).forEach(index => {
      this[index] = [];
      collections[index].forEach(entity => {
        if (typeof entity === 'number') {
          this[index].push(entity);
        }
      });
    });

    return this.markClean();
  }

  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  setResource(resource) {
    return this.define('__resource', resource);
  }

  destroy() {
    if (!this.getId()) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.getId());
  }

  getName() {
    let metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  static getName() {
    let metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  setData(data, markClean) {
    Object.assign(this, data);

    if (markClean) {
      this.markClean();
    }

    return this;
  }

  setValidator(validator) {
    this.define('__validator', validator);

    return this;
  }

  getValidator() {
    if (!this.hasValidation()) {
      return null;
    }

    return this.__validator;
  }

  hasValidation() {
    return !!this.getMeta().fetch('validation');
  }

  validate(propertyName, rules) {
    if (!this.hasValidation()) {
      return Promise.resolve([]);
    }

    return propertyName ? this.getValidator().validateProperty(this, propertyName, rules) : this.getValidator().validateObject(this, rules);
  }

  asObject(shallow) {
    return asObject(this, shallow);
  }

  asJson(shallow) {
    return asJson(this, shallow);
  }
}) || _class4);

function asObject(entity, shallow) {
  let pojo = {};
  let metadata = entity.getMeta();

  Object.keys(entity).forEach(propertyName => {
    let value = entity[propertyName];
    let associationMeta = metadata.fetch('associations', propertyName);
    let typeMeta = metadata.fetch('types', propertyName);

    if (associationMeta && associationMeta.ignoreOnSave) {
      return;
    }

    if (value && typeof value === 'object') {
      if (typeMeta === 'datetime' && typeof value.toISOString === 'function') {
        pojo[propertyName] = value.toISOString();

        return;
      } else if (typeMeta === 'date' && typeof value.format === 'function') {
        pojo[propertyName] = value.format('YYYY-MM-DD');

        return;
      }
    }

    if (!associationMeta || !value) {
      pojo[propertyName] = value;

      return;
    }

    if (shallow) {
      if (value.id && associationMeta.includeOnlyIds) {
        pojo[`${ propertyName }Id`] = value.id;

        return;
      } else if (Array.isArray(value) && associationMeta.includeOnlyIds) {
        pojo[`${ propertyName.replace(/s$/, '') }Ids`] = value.map(v => v.id);

        return;
      } else if (value instanceof Entity) {
        pojo[propertyName] = value.asObject();

        return;
      } else if (['string', 'number', 'boolean'].indexOf(typeof value) > -1 || value.constructor === Object) {
        pojo[propertyName] = value;

        return;
      }
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    let asObjects = [];

    value.forEach(childValue => {
      if (typeof childValue !== 'object') {
        return;
      }

      if (!(childValue instanceof Entity)) {
        asObjects.push(childValue);

        return;
      }

      asObjects.push(childValue.asObject(shallow));
    });

    if (asObjects.length > 0) {
      pojo[propertyName] = asObjects;
    }
  });

  return pojo;
}

function asJson(entity, shallow) {
  let json;

  try {
    json = JSON.stringify(asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity, includeNew) {
  let associations = forEntity.getMeta().fetch('associations');
  let collections = {};

  Object.getOwnPropertyNames(associations).forEach(index => {
    let association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];

    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(entity => {
      if (typeof entity === 'number') {
        collections[index].push(entity);

        return;
      }

      if (!(entity instanceof Entity)) {
        return;
      }

      if (entity.getId()) {
        collections[index].push(entity.getId());

        return;
      }

      if (includeNew) {
        collections[index].push(entity);

        return;
      }
    });
  });

  return collections;
}

function getFlat(entity, json) {
  let flat = {
    entity: asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  let associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(key => {
    return associations[key].entity === entity.getResource();
  })[0];
}

export let OrmMetadata = class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  }
};

export let Metadata = (_temp = _class5 = class Metadata {
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
      idProperty: 'id',
      associations: {}
    };
  }

  addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  }

  put(key, valueOrNestedKey, valueOrNull) {
    if (!valueOrNull) {
      this.metadata[key] = valueOrNestedKey;

      return this;
    }

    if (typeof this.metadata[key] !== 'object') {
      this.metadata[key] = {};
    }

    this.metadata[key][valueOrNestedKey] = valueOrNull;

    return this;
  }

  has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  }

  fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  }
}, _class5.key = 'spoonx:orm:metadata', _temp);

export let Repository = (_dec4 = inject(Config), _dec4(_class6 = class Repository {
  constructor(clientConfig) {
    this.enableRootObjects = true;
    this.transport = null;

    this.clientConfig = clientConfig;
  }

  getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error(`No transport found for '${ this.getMeta().fetch('endpoint') || 'default' }'.`);
      }
    }

    return this.transport;
  }

  setMeta(meta) {
    this.meta = meta;
  }

  getMeta() {
    return this.meta;
  }

  setResource(resource) {
    this.resource = resource;

    return this;
  }

  getResource() {
    return this.resource;
  }

  get jsonRootObjectSingle() {
    const jsonRoot = this.getJsonRootObject();

    if (typeof jsonRoot === 'object') {
      return stringToCamelCase(jsonRoot.single);
    }

    return stringToCamelCase(jsonRoot.replace(/s$/, ''));
  }

  get jsonRootObjectPlural() {
    let jsonRoot = this.getJsonRootObject();

    jsonRoot = typeof jsonRoot === 'object' ? jsonRoot.plural : jsonRoot;

    return stringToCamelCase(jsonRoot);
  }

  getJsonRootObject() {
    let entity = this.getNewEntity();
    let jsonRoot = entity.getMeta().fetch('jsonRoot');

    return jsonRoot ? jsonRoot : this.resource;
  }

  find(criteria, raw, options) {
    return this.findPath(this.resource, criteria, raw, false, options);
  }

  search(criteria, raw, options) {
    return this.findPath(this.resource, criteria, raw, true, options);
  }

  findPath(path, criteria, raw, collection = false, options = {}) {
    let findQuery = this.getTransport().find(path, criteria, options);

    if (raw) {
      return findQuery;
    }

    return findQuery.then(response => {
      if (this.enableRootObjects) {
        let rootObject = collection ? this.jsonRootObjectPlural : this.jsonRootObjectSingle;

        response = response[rootObject];
      }

      return this.populateEntities(response);
    }).then(populated => {
      if (!populated) {
        return null;
      }

      if (!Array.isArray(populated)) {
        return populated.markClean();
      }

      populated.forEach(entity => entity.markClean());

      return populated;
    });
  }

  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  populateEntities(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data);
    }

    let collection = [];

    data.forEach(source => {
      collection.push(this.getPopulatedEntity(source));
    });

    return collection;
  }

  getPopulatedEntity(data, entity) {
    entity = entity || this.getNewEntity();
    let entityMetadata = entity.getMeta();
    let populatedData = {};
    let key;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      let value = data[key];

      if (entityMetadata.has('types', key)) {
        populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

        continue;
      }

      if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
        populatedData[key] = value;

        continue;
      }

      let repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);

      populatedData[key] = repository.populateEntities(value);
    }

    return entity.setData(populatedData);
  }

  getNewEntity() {
    return this.entityManager.getEntity(this.resource);
  }

  getNewPopulatedEntity() {
    let entity = this.getNewEntity();
    let associations = entity.getMeta().fetch('associations');

    for (let property in associations) {
      if (associations.hasOwnProperty(property)) {
        let assocMeta = associations[property];

        if (assocMeta.type !== 'entity' || !assocMeta.populateOnCreate) {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }
    }

    return entity;
  }
}) || _class6);

export function stringToCamelCase(str) {
  return str.replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}

export let AssociationSelect = (_dec5 = customElement('association-select'), _dec6 = inject(BindingEngine, EntityManager, Element), _dec7 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec8 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec5(_class8 = _dec6(_class8 = (_class9 = class AssociationSelect {
  constructor(bindingEngine, entityManager) {
    _initDefineProp(this, 'criteria', _descriptor, this);

    _initDefineProp(this, 'repository', _descriptor2, this);

    _initDefineProp(this, 'identifier', _descriptor3, this);

    _initDefineProp(this, 'property', _descriptor4, this);

    _initDefineProp(this, 'resource', _descriptor5, this);

    _initDefineProp(this, 'options', _descriptor6, this);

    _initDefineProp(this, 'association', _descriptor7, this);

    _initDefineProp(this, 'manyAssociation', _descriptor8, this);

    _initDefineProp(this, 'value', _descriptor9, this);

    _initDefineProp(this, 'error', _descriptor10, this);

    _initDefineProp(this, 'multiple', _descriptor11, this);

    _initDefineProp(this, 'hidePlaceholder', _descriptor12, this);

    _initDefineProp(this, 'selectablePlaceholder', _descriptor13, this);

    _initDefineProp(this, 'placeholderText', _descriptor14, this);

    this.matcher = (a, b) => a && b && a.id === b.id;

    this._subscriptions = [];
    this.bindingEngine = bindingEngine;
    this.entityManager = entityManager;
  }

  load(reservedValue) {
    return this.buildFind().then(options => {
      let result = options;

      this.options = Array.isArray(result) ? result : [result];

      this.setValue(reservedValue);
    });
  }

  setValue(value) {
    if (!value) {
      return;
    }

    if (!Array.isArray(value)) {
      this.value = typeof value === 'object' ? getProp(value, this.identifier) : value;

      return;
    }

    let selectedValues = [];

    value.forEach(selected => {
      selectedValues.push(selected instanceof Entity ? selected.getId() : selected);
    });

    this.value = selectedValues;
  }

  getCriteria() {
    if (typeof this.criteria !== 'object') {
      return {};
    }

    return JSON.parse(JSON.stringify(this.criteria || {}));
  }

  buildFind() {
    let repository = this.repository;
    let criteria = this.getCriteria();
    let findPath = repository.getResource();

    criteria.populate = false;

    if (this.manyAssociation) {
      let assoc = this.manyAssociation;

      delete criteria.populate;

      findPath = `${ assoc.getResource() }/${ assoc.getId() }/${ findPath }`;
    } else if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      associations.forEach(association => {
        criteria[this.propertyForResource(this.ownMeta, association.getResource())] = association.getId();
      });
    }

    return repository.findPath(findPath, criteria, false, true).catch(error => {
      this.error = error;

      return error;
    });
  }

  verifyAssociationValues() {
    if (this.manyAssociation) {
      return !!this.manyAssociation.getId();
    }

    if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      return !associations.some(association => {
        return !association.getId();
      });
    }

    return true;
  }

  observe(association) {
    if (Array.isArray(association)) {
      association.forEach(assoc => this.observe(assoc));

      return this;
    }

    this._subscriptions.push(this.bindingEngine.propertyObserver(association, association.getIdProperty()).subscribe(() => {
      if (this.verifyAssociationValues()) {
        return this.load();
      }

      this.options = undefined;

      return Promise.resolve();
    }));

    return this;
  }

  isChanged(property, newVal, oldVal) {
    return !this[property] || !newVal || newVal === oldVal;
  }

  resourceChanged(resource) {
    if (!resource) {
      logger.error(`resource is ${ typeof resource }. It should be a string or a reference`);
    }

    this.repository = this.entityManager.getRepository(resource);
  }

  criteriaChanged(newVal, oldVal) {
    if (this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    if (this.value) {
      this.load(this.value);
    }
  }

  attached() {
    if (!this.association && !this.manyAssociation) {
      this.load(this.value);

      return;
    }

    this.ownMeta = OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

    if (this.manyAssociation) {
      this.observe(this.manyAssociation);
    }

    if (this.association) {
      this.observe(this.association);
    }

    if (this.value) {
      this.load(this.value);
    }
  }

  propertyForResource(meta, resource) {
    let associations = meta.fetch('associations');

    return Object.keys(associations).filter(key => {
      return associations[key].entity === resource;
    })[0];
  }

  unbind() {
    this._subscriptions.forEach(subscription => subscription.dispose());
  }
}, (_descriptor = _applyDecoratedDescriptor(_class9.prototype, 'criteria', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class9.prototype, 'repository', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class9.prototype, 'identifier', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return 'id';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class9.prototype, 'property', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return 'name';
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class9.prototype, 'resource', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class9.prototype, 'options', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class9.prototype, 'association', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class9.prototype, 'manyAssociation', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class9.prototype, 'value', [_dec7], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class9.prototype, 'error', [_dec8], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class9.prototype, 'multiple', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class9.prototype, 'hidePlaceholder', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class9.prototype, 'selectablePlaceholder', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class9.prototype, 'placeholderText', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
})), _class9)) || _class8) || _class8);

export let Paged = (_dec9 = customElement('paged'), _dec10 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec11 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec12 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec9(_class11 = (_class12 = class Paged {
  constructor() {
    _initDefineProp(this, 'data', _descriptor15, this);

    _initDefineProp(this, 'page', _descriptor16, this);

    _initDefineProp(this, 'error', _descriptor17, this);

    _initDefineProp(this, 'criteria', _descriptor18, this);

    _initDefineProp(this, 'repository', _descriptor19, this);

    _initDefineProp(this, 'resource', _descriptor20, this);

    _initDefineProp(this, 'limit', _descriptor21, this);
  }

  attached() {
    if (!this.page) {
      this.page = 1;
    }

    if (!this.criteria) {
      this.criteria = {};
    }

    this.reloadData();
  }

  reloadData() {
    this.getData();
  }

  isChanged(property, newVal, oldVal) {
    return !this[property] || !newVal || newVal === oldVal;
  }

  pageChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal) || this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  resourceChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  criteriaChanged(newVal, oldVal) {
    if (this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  resourceChanged(resource) {
    if (!resource) {
      logger.error(`resource is ${ typeof resource }. It should be a string or a reference`);
    }

    this.repository = this.entityManager.getRepository(resource);
  }

  getData() {
    let criteria = JSON.parse(JSON.stringify(this.criteria));

    criteria.skip = this.page * this.limit - this.limit;
    criteria.limit = this.limit;
    this.error = null;

    this.repository.find(criteria, true).then(result => {
      this.data = result;
    }).catch(error => {
      this.error = error;
    });
  }
}, (_descriptor15 = _applyDecoratedDescriptor(_class12.prototype, 'data', [_dec10], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class12.prototype, 'page', [_dec11], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return 1;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class12.prototype, 'error', [_dec12], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor18 = _applyDecoratedDescriptor(_class12.prototype, 'criteria', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor19 = _applyDecoratedDescriptor(_class12.prototype, 'repository', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class12.prototype, 'resource', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: null
}), _descriptor21 = _applyDecoratedDescriptor(_class12.prototype, 'limit', [bindable], {
  configurable: true,
  enumerable: true,
  initializer: function () {
    return 30;
  }
})), _class12)) || _class11);

export function association(associationData) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    if (!associationData) {
      associationData = { entity: propertyName };
    } else if (typeof associationData === 'string') {
      associationData = { entity: associationData };
    }

    OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
      type: associationData.entity ? 'entity' : 'collection',
      entity: associationData.entity || associationData.collection,
      includeOnlyIds: associationData.hasOwnProperty('includeOnlyIds') ? associationData.includeOnlyIds : true,
      ignoreOnSave: associationData.hasOwnProperty('ignoreOnSave') ? associationData.ignoreOnSave : false,
      populateOnCreate: associationData.hasOwnProperty('populateOnCreate') ? associationData.populateOnCreate : true
    });
  };
}

export function data(metaData) {
  return function (target, propertyName) {
    if (typeof metaData !== 'object') {
      logger.error('data must be an object, ' + typeof metaData + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}

export function endpoint(entityEndpoint) {
  return function (target) {
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

export function idProperty(propertyName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}

export function jsonRoot(name) {
  return function (target) {
    OrmMetadata.forTarget(target).put('jsonRoot', name);
  };
}

export function name(entityName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

export function repository(repositoryReference) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

export function resource(resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

export function type(typeValue) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}

export function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
  if (descriptor && descriptor.configurable === false) {
    descriptor.configurable = true;

    if (!Reflect.defineProperty(target, propertyName, descriptor)) {
      logger.warn(`Cannot make configurable property '${ propertyName }' of object`, target);
    }
  }
}

export function validatedResource(resourceName, ValidatorClass) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation(ValidatorClass)(target, propertyName);
  };
}

export function validation(ValidatorClass = Validator) {
  return function (target) {
    OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}