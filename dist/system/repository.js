'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-api', './utils', 'typer'], function (_export, _context) {
  "use strict";

  var inject, Config, stringToCamelCase, typer, _typeof, _createClass, _dec, _class, Repository;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaApi) {
      Config = _aureliaApi.Config;
    }, function (_utils) {
      stringToCamelCase = _utils.stringToCamelCase;
    }, function (_typer) {
      typer = _typer.default;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Repository', Repository = (_dec = inject(Config), _dec(_class = function () {
        function Repository(clientConfig) {
          _classCallCheck(this, Repository);

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
              populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

              continue;
            }

            if (!entityMetadata.has('associations', key) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
              populatedData[key] = value;

              continue;
            }

            var repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);

            populatedData[key] = repository.populateEntities(value);
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
      }()) || _class));

      _export('Repository', Repository);
    }
  };
});