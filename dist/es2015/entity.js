var _dec, _class;

import { transient } from 'aurelia-dependency-injection';
import { OrmMetadata } from './orm-metadata';

export let Entity = (_dec = transient(), _dec(_class = class Entity {
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
}) || _class);

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