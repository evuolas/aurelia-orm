'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _ormMetadata = require('./orm-metadata');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = exports.Entity = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
  function Entity() {
    _classCallCheck(this, Entity);

    this.define('__meta', _ormMetadata.OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);
  }

  Entity.prototype.getTransport = function getTransport() {
    return this.getRepository().getTransport();
  };

  Entity.prototype.getRepository = function getRepository() {
    return this.__repository;
  };

  Entity.prototype.setRepository = function setRepository(repository) {
    return this.define('__repository', repository);
  };

  Entity.prototype.define = function define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  };

  Entity.prototype.getMeta = function getMeta() {
    return this.__meta;
  };

  Entity.prototype.getIdProperty = function getIdProperty() {
    return this.getMeta().fetch('idProperty');
  };

  Entity.getIdProperty = function getIdProperty() {
    var idProperty = _ormMetadata.OrmMetadata.forTarget(this).fetch('idProperty');

    return idProperty;
  };

  Entity.prototype.getId = function getId() {
    return this[this.getIdProperty()];
  };

  Entity.prototype.setId = function setId(id) {
    this[this.getIdProperty()] = id;

    return this;
  };

  Entity.prototype.save = function save(path, options) {
    var _this = this;

    if (!this.isNew()) {
      return this.update(path, options);
    }

    var repository = this.getRepository();
    var requestBody = this.asObject(true);
    var response = void 0;

    var rootObject = repository.enableRootObjects;

    if (rootObject) {
      var bodyWithRoot = {};

      bodyWithRoot[repository.jsonRootObjectSingle] = requestBody;
      requestBody = bodyWithRoot;
    }

    if (!path) {
      path = this.getResource();
    }

    return this.getTransport().create(path, requestBody, options).then(function (created) {
      var data = rootObject ? created[repository.jsonRootObjectSingle] : created;

      _this.setId(data[_this.getIdProperty()]);
      response = data;
    }).then(function () {
      return _this.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.update = function update(path, options) {
    var _this2 = this;

    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return Promise.resolve(null);
    }

    var repository = this.getRepository();
    var requestBody = this.asObject(true);
    var response = void 0;

    var rootObject = repository.enableRootObjects;

    if (rootObject) {
      var bodyWithRoot = {};

      bodyWithRoot[repository.jsonRootObjectSingle] = requestBody;
      requestBody = bodyWithRoot;
    }

    delete requestBody[this.getIdProperty()];

    if (!path) {
      path = this.getResource();
    }

    return this.getTransport().update(path, this.getId(), requestBody, options).then(function (updated) {
      var data = rootObject ? updated[repository.jsonRootObjectSingle] : updated;

      response = data;
    }).then(function () {
      return _this2.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.addCollectionAssociation = function addCollectionAssociation(entity, property) {
    var _this3 = this;

    property = property || getPropertyForAssociation(this, entity);
    var url = [this.getResource(), this.getId(), property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      var associationProperty = getPropertyForAssociation(entity, this);
      var relation = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        return entity.save().then(function () {
          if (entity.isNew()) {
            throw new Error('Entity did not return return an id on saving.');
          }

          return _this3.addCollectionAssociation(entity, property);
        });
      }

      entity[associationProperty] = this.getId();

      return entity.save().then(function () {
        return entity;
      });
    }

    url.push(entity.getId());

    return this.getTransport().create(url.join('/')).then(function () {
      return entity;
    });
  };

  Entity.prototype.removeCollectionAssociation = function removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    var idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.getId()) {
        return Promise.resolve(null);
      }

      idToRemove = entity.getId();
    }

    return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
  };

  Entity.prototype.saveCollections = function saveCollections() {
    var _this4 = this;

    var tasks = [];
    var currentCollections = getCollectionsCompact(this, true);
    var cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    var addTasksForDifferences = function addTasksForDifferences(base, candidate, method) {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(function (property) {
        base[property].forEach(function (id) {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(_this4, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(function (results) {
      return _this4;
    });
  };

  Entity.prototype.markClean = function markClean() {
    var cleanValues = getFlat(this);

    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  };

  Entity.prototype.isClean = function isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  };

  Entity.prototype.isDirty = function isDirty() {
    return !this.isClean();
  };

  Entity.prototype.isNew = function isNew() {
    return !this.getId();
  };

  Entity.prototype.reset = function reset(shallow) {
    var _this5 = this;

    var pojo = {};
    var metadata = this.getMeta();

    Object.keys(this).forEach(function (propertyName) {
      var value = _this5[propertyName];
      var association = metadata.fetch('associations', propertyName);

      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }
    });

    if (this.isClean()) {
      return this;
    }

    var isNew = this.isNew();
    var associations = this.getMeta().fetch('associations');

    Object.keys(this).forEach(function (propertyName) {
      if (Object.getOwnPropertyNames(associations).indexOf(propertyName) === -1) {
        delete _this5[propertyName];
      }
    });

    if (isNew) {
      return this.markClean();
    }

    this.setData(this.__cleanValues.data.entity);

    if (shallow) {
      return this.markClean();
    }

    var collections = this.__cleanValues.data.collections;

    Object.getOwnPropertyNames(collections).forEach(function (index) {
      _this5[index] = [];
      collections[index].forEach(function (entity) {
        if (typeof entity === 'number') {
          _this5[index].push(entity);
        }
      });
    });

    return this.markClean();
  };

  Entity.getResource = function getResource() {
    return _ormMetadata.OrmMetadata.forTarget(this).fetch('resource');
  };

  Entity.prototype.getResource = function getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  };

  Entity.prototype.setResource = function setResource(resource) {
    return this.define('__resource', resource);
  };

  Entity.prototype.destroy = function destroy() {
    if (!this.getId()) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.getId());
  };

  Entity.prototype.getName = function getName() {
    var metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  };

  Entity.getName = function getName() {
    var metaName = _ormMetadata.OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  };

  Entity.prototype.setData = function setData(data, markClean) {
    Object.assign(this, data);

    if (markClean) {
      this.markClean();
    }

    return this;
  };

  Entity.prototype.setValidator = function setValidator(validator) {
    this.define('__validator', validator);

    return this;
  };

  Entity.prototype.getValidator = function getValidator() {
    if (!this.hasValidation()) {
      return null;
    }

    return this.__validator;
  };

  Entity.prototype.hasValidation = function hasValidation() {
    return !!this.getMeta().fetch('validation');
  };

  Entity.prototype.validate = function validate(propertyName, rules) {
    if (!this.hasValidation()) {
      return Promise.resolve([]);
    }

    return propertyName ? this.getValidator().validateProperty(this, propertyName, rules) : this.getValidator().validateObject(this, rules);
  };

  Entity.prototype.asObject = function asObject(shallow) {
    return _asObject(this, shallow);
  };

  Entity.prototype.asJson = function asJson(shallow) {
    return _asJson(this, shallow);
  };

  return Entity;
}()) || _class);

function _asObject(entity, shallow) {
  var pojo = {};
  var metadata = entity.getMeta();

  Object.keys(entity).forEach(function (propertyName) {
    var value = entity[propertyName];
    var associationMeta = metadata.fetch('associations', propertyName);
    var typeMeta = metadata.fetch('types', propertyName);

    if (associationMeta && associationMeta.ignoreOnSave) {
      return;
    }

    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
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
        pojo[propertyName + 'Id'] = value.id;

        return;
      } else if (Array.isArray(value) && associationMeta.includeOnlyIds) {
        pojo[propertyName.replace(/s$/, '') + 'Ids'] = value.map(function (v) {
          return v.id;
        });

        return;
      } else if (value instanceof Entity) {
        pojo[propertyName] = value.asObject();

        return;
      } else if (['string', 'number', 'boolean'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1 || value.constructor === Object) {
        pojo[propertyName] = value;

        return;
      }
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    var asObjects = [];

    value.forEach(function (childValue) {
      if ((typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) !== 'object') {
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

function _asJson(entity, shallow) {
  var json = void 0;

  try {
    json = JSON.stringify(_asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity, includeNew) {
  var associations = forEntity.getMeta().fetch('associations');
  var collections = {};

  Object.getOwnPropertyNames(associations).forEach(function (index) {
    var association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];

    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(function (entity) {
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
  var flat = {
    entity: _asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  var associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(function (key) {
    return associations[key].entity === entity.getResource();
  })[0];
}