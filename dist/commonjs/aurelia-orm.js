'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.EntityManager = exports.Entity = exports.Metadata = exports.OrmMetadata = exports.DefaultRepository = exports.Repository = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _dec2, _class3, _class4, _temp, _dec3, _class5, _dec4, _class6;

exports.stringToCamelCase = stringToCamelCase;
exports.idProperty = idProperty;
exports.jsonRoot = jsonRoot;
exports.name = name;
exports.repository = repository;
exports.resource = resource;
exports.validation = validation;
exports.validatedResource = validatedResource;
exports.configure = configure;
exports.data = data;
exports.endpoint = endpoint;
exports.ensurePropertyIsConfigurable = ensurePropertyIsConfigurable;
exports.association = association;
exports.type = type;

var _typer = require('typer');

var _typer2 = _interopRequireDefault(_typer);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaApi = require('aurelia-api');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaValidation = require('aurelia-validation');

var _aureliaLogging = require('aurelia-logging');

var _associationSelect = require('./component/association-select');

var _paged = require('./component/paged');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



function stringToCamelCase(str) {
  return str.replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}

var Repository = exports.Repository = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaApi.Config), _dec(_class = function () {
  function Repository(clientConfig) {
    

    this.enableRootObjects = true;
    this.transport = null;

    this.clientConfig = clientConfig;
  }

  Repository.prototype.getTransport = function getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error('No transport found for \'' + (this.getMeta().fetch('endpoint') || 'default') + '\'.');
      }
    }

    return this.transport;
  };

  Repository.prototype.setMeta = function setMeta(meta) {
    this.meta = meta;
  };

  Repository.prototype.getMeta = function getMeta() {
    return this.meta;
  };

  Repository.prototype.setResource = function setResource(resource) {
    this.resource = resource;

    return this;
  };

  Repository.prototype.getResource = function getResource() {
    return this.resource;
  };

  Repository.prototype.getJsonRootObject = function getJsonRootObject() {
    var entity = this.getNewEntity();
    var jsonRoot = entity.getMeta().fetch('jsonRoot');

    return jsonRoot ? jsonRoot : this.resource;
  };

  Repository.prototype.find = function find(criteria, raw, options) {
    return this.findPath(this.resource, criteria, raw, false, options);
  };

  Repository.prototype.search = function search(criteria, raw, options) {
    return this.findPath(this.resource, criteria, raw, true, options);
  };

  Repository.prototype.findPath = function findPath(path, criteria, raw) {
    var _this = this;

    var collection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var findQuery = this.getTransport().find(path, criteria, options);

    if (raw) {
      return findQuery;
    }

    return findQuery.then(function (response) {
      if (_this.enableRootObjects) {
        var rootObject = collection ? _this.jsonRootObjectPlural : _this.jsonRootObjectSingle;

        response = response[rootObject];
      }

      return _this.populateEntities(response);
    }).then(function (populated) {
      if (!populated) {
        return null;
      }

      if (!Array.isArray(populated)) {
        return populated.markClean();
      }

      populated.forEach(function (entity) {
        return entity.markClean();
      });

      return populated;
    });
  };

  Repository.prototype.count = function count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  };

  Repository.prototype.populateEntities = function populateEntities(data) {
    var _this2 = this;

    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data);
    }

    var collection = [];

    data.forEach(function (source) {
      collection.push(_this2.getPopulatedEntity(source));
    });

    return collection;
  };

  Repository.prototype.getPopulatedEntity = function getPopulatedEntity(data, entity) {
    entity = entity || this.getNewEntity();
    var entityMetadata = entity.getMeta();
    var populatedData = {};
    var key = void 0;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      var value = data[key];

      if (entityMetadata.has('types', key)) {
        populatedData[key] = _typer2.default.cast(value, entityMetadata.fetch('types', key));

        continue;
      }

      if (!entityMetadata.has('associations', key) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        populatedData[key] = value;

        continue;
      }

      var _repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);

      populatedData[key] = _repository.populateEntities(value);
    }

    return entity.setData(populatedData);
  };

  Repository.prototype.getNewEntity = function getNewEntity() {
    return this.entityManager.getEntity(this.resource);
  };

  Repository.prototype.getNewPopulatedEntity = function getNewPopulatedEntity() {
    var entity = this.getNewEntity();
    var associations = entity.getMeta().fetch('associations');

    for (var property in associations) {
      if (associations.hasOwnProperty(property)) {
        var assocMeta = associations[property];

        if (assocMeta.type !== 'entity' || !assocMeta.populateOnCreate) {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }
    }

    return entity;
  };

  _createClass(Repository, [{
    key: 'jsonRootObjectSingle',
    get: function get() {
      var jsonRoot = this.getJsonRootObject();

      if ((typeof jsonRoot === 'undefined' ? 'undefined' : _typeof(jsonRoot)) === 'object') {
        return stringToCamelCase(jsonRoot.single);
      }

      return stringToCamelCase(jsonRoot.replace(/s$/, ''));
    }
  }, {
    key: 'jsonRootObjectPlural',
    get: function get() {
      var jsonRoot = this.getJsonRootObject();

      jsonRoot = (typeof jsonRoot === 'undefined' ? 'undefined' : _typeof(jsonRoot)) === 'object' ? jsonRoot.plural : jsonRoot;

      return stringToCamelCase(jsonRoot);
    }
  }]);

  return Repository;
}()) || _class);
var DefaultRepository = exports.DefaultRepository = (_dec2 = (0, _aureliaDependencyInjection.transient)(), _dec2(_class3 = function (_Repository) {
  _inherits(DefaultRepository, _Repository);

  function DefaultRepository() {
    

    return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
  }

  return DefaultRepository;
}(Repository)) || _class3);

var OrmMetadata = exports.OrmMetadata = function () {
  function OrmMetadata() {
    
  }

  OrmMetadata.forTarget = function forTarget(target) {
    return _aureliaMetadata.metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  };

  return OrmMetadata;
}();

var Metadata = exports.Metadata = (_temp = _class4 = function () {
  function Metadata() {
    

    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
      idProperty: 'id',
      associations: {}
    };
  }

  Metadata.prototype.addTo = function addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  };

  Metadata.prototype.put = function put(key, valueOrNestedKey, valueOrNull) {
    if (!valueOrNull) {
      this.metadata[key] = valueOrNestedKey;

      return this;
    }

    if (_typeof(this.metadata[key]) !== 'object') {
      this.metadata[key] = {};
    }

    this.metadata[key][valueOrNestedKey] = valueOrNull;

    return this;
  };

  Metadata.prototype.has = function has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  };

  Metadata.prototype.fetch = function fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  };

  return Metadata;
}(), _class4.key = 'spoonx:orm:metadata', _temp);
var Entity = exports.Entity = (_dec3 = (0, _aureliaDependencyInjection.transient)(), _dec3(_class5 = function () {
  function Entity() {
    

    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);
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
    var idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

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
    var _this4 = this;

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

      _this4.setId(data[_this4.getIdProperty()]);
      response = data;
    }).then(function () {
      return _this4.saveCollections();
    }).then(function () {
      return _this4.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.update = function update(path, options) {
    var _this5 = this;

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
      return _this5.saveCollections();
    }).then(function () {
      return _this5.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.addCollectionAssociation = function addCollectionAssociation(entity, property) {
    var _this6 = this;

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

          return _this6.addCollectionAssociation(entity, property);
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
    var _this7 = this;

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
            tasks.push(method.call(_this7, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(function (results) {
      return _this7;
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
    var _this8 = this;

    var pojo = {};
    var metadata = this.getMeta();

    Object.keys(this).forEach(function (propertyName) {
      var value = _this8[propertyName];
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
        delete _this8[propertyName];
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
      _this8[index] = [];
      collections[index].forEach(function (entity) {
        if (typeof entity === 'number') {
          _this8[index].push(entity);
        }
      });
    });

    return this.markClean();
  };

  Entity.getResource = function getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
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
    var metaName = OrmMetadata.forTarget(this).fetch('name');

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
}()) || _class5);

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

      if (value instanceof Entity && value.getId()) {
        pojo[propertyName] = value.getId();

        return;
      }

      if (value instanceof Entity) {
        pojo[propertyName] = value.asObject();

        return;
      }

      if (['string', 'number', 'boolean'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1 || value.constructor === Object) {
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

      if (!shallow || (typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) === 'object' && !childValue.getId()) {
        asObjects.push(childValue.asObject(shallow));
      }
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

function idProperty(propertyName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}

function jsonRoot(name) {
  return function (target) {
    OrmMetadata.forTarget(target).put('jsonRoot', name);
  };
}

function name(entityName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

function repository(repositoryReference) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

function resource(resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

function validation() {
  var ValidatorClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _aureliaValidation.Validator;

  return function (target) {
    OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}

var EntityManager = exports.EntityManager = (_dec4 = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.Container), _dec4(_class6 = function () {
  function EntityManager(container) {
    

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
    this.entities[OrmMetadata.forTarget(EntityClass).fetch('resource')] = EntityClass;

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

    var metaData = OrmMetadata.forTarget(reference);
    var repository = metaData.fetch('repository');
    var instance = this.container.get(repository);

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
  };

  EntityManager.prototype.resolveEntityReference = function resolveEntityReference(resource) {
    var entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || Entity;
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
      var validator = this.container.get(OrmMetadata.forTarget(reference).fetch('validation'));

      instance.setValidator(validator);
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  };

  return EntityManager;
}()) || _class6);
function validatedResource(resourceName, ValidatorClass) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation(ValidatorClass)(target, propertyName);
  };
}

function configure(frameworkConfig, configCallback) {
  _aureliaValidation.ValidationRules.customRule('hasAssociation', function (value) {
    return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
  }, '${$displayName} must be an association.');

  var entityManagerInstance = frameworkConfig.container.get(EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

var logger = exports.logger = (0, _aureliaLogging.getLogger)('aurelia-orm');

function data(metaData) {
  return function (target, propertyName) {
    if ((typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) !== 'object') {
      logger.error('data must be an object, ' + (typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}

function endpoint(entityEndpoint) {
  return function (target) {
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
  if (descriptor && descriptor.configurable === false) {
    descriptor.configurable = true;

    if (!Reflect.defineProperty(target, propertyName, descriptor)) {
      logger.warn('Cannot make configurable property \'' + propertyName + '\' of object', target);
    }
  }
}

function association(associationData) {
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

function type(typeValue) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}