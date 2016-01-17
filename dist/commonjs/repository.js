'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFramework = require('aurelia-framework');

var _aureliaApi = require('aurelia-api');

var _aureliaApiUtils = require('aurelia-api/utils');

var Repository = (function () {
  function Repository(restClient) {
    _classCallCheck(this, _Repository);

    this.enableRootObjects = true;

    this.api = restClient;
  }

  _createClass(Repository, [{
    key: 'setResource',
    value: function setResource(resource) {
      this.resource = resource;

      return this;
    }
  }, {
    key: 'getResource',
    value: function getResource() {
      return this.resource;
    }
  }, {
    key: 'find',
    value: function find(criteria, raw) {
      return this.findPath(this.resource, criteria, raw);
    }
  }, {
    key: 'search',
    value: function search(criteria, raw) {
      return this.findPath(this.resource, criteria, raw, true);
    }
  }, {
    key: 'findPath',
    value: function findPath(path, criteria, raw) {
      var _this = this;

      var collection = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var findQuery = this.api.find(path, criteria);

      if (raw) {
        return findQuery;
      }

      return findQuery.then(function (x) {
        if (_this.enableRootObjects) {
          var rootObject = collection ? _this.jsonRootObjectPlural : _this.jsonRootObjectSingle;
          x = x[rootObject];
        }

        return _this.populateEntities(x);
      }).then(function (populated) {
        if (!Array.isArray(populated)) {
          return populated;
        }

        populated.forEach(function (entity) {
          return entity.markClean();
        });

        return populated;
      });
    }
  }, {
    key: 'count',
    value: function count(criteria) {
      return this.api.find(this.resource + '/count', criteria);
    }
  }, {
    key: 'populateEntities',
    value: function populateEntities(data) {
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
    }
  }, {
    key: 'getPopulatedEntity',
    value: function getPopulatedEntity(data, entity) {
      entity = entity || this.getNewEntity();
      var entityMetadata = entity.getMeta();
      var populatedData = {};
      var key = undefined;

      for (key in data) {
        if (!data.hasOwnProperty(key)) {
          continue;
        }

        var value = data[key];

        if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
          populatedData[key] = value;

          continue;
        }

        var repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
        populatedData[key] = repository.populateEntities(value);
      }

      return entity.setData(populatedData);
    }
  }, {
    key: 'getNewEntity',
    value: function getNewEntity() {
      return this.entityManager.getEntity(this.resource);
    }
  }, {
    key: 'getNewPopulatedEntity',
    value: function getNewPopulatedEntity() {
      var entity = this.getNewEntity();
      var associations = entity.getMeta().fetch('associations');

      for (var property in associations) {
        var assocMeta = associations[property];

        if (assocMeta.type !== 'entity') {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }

      return entity;
    }
  }, {
    key: 'jsonRootObjectSingle',
    get: function get() {
      return (0, _aureliaApiUtils.stringToCamelCase)(this.resource.replace(/s$/, ''));
    }
  }, {
    key: 'jsonRootObjectPlural',
    get: function get() {
      return (0, _aureliaApiUtils.stringToCamelCase)(this.resource);
    }
  }]);

  var _Repository = Repository;
  Repository = (0, _aureliaFramework.inject)(_aureliaApi.Rest)(Repository) || Repository;
  return Repository;
})();

exports.Repository = Repository;