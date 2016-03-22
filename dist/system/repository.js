<<<<<<< HEAD
System.register(['aurelia-dependency-injection', 'spoonx/aurelia-api', './utils'], function (_export) {
  'use strict';

  var inject, Config, stringToCamelCase, Repository;
=======
System.register(['aurelia-dependency-injection', 'spoonx/aurelia-api', 'typer'], function (_export) {
  'use strict';

  var inject, Config, typer, Repository;
>>>>>>> SpoonX/master

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_spoonxAureliaApi) {
      Config = _spoonxAureliaApi.Config;
<<<<<<< HEAD
    }, function (_utils) {
      stringToCamelCase = _utils.stringToCamelCase;
=======
    }, function (_typer) {
      typer = _typer['default'];
>>>>>>> SpoonX/master
    }],
    execute: function () {
      Repository = (function () {
        function Repository(clientConfig) {
          _classCallCheck(this, _Repository);

<<<<<<< HEAD
          this.enableRootObjects = true;
=======
>>>>>>> SpoonX/master
          this.transport = null;

          this.clientConfig = clientConfig;
        }

        _createClass(Repository, [{
          key: 'getTransport',
          value: function getTransport() {
            if (this.transport === null) {
              this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));
            }

            return this.transport;
          }
        }, {
          key: 'setMeta',
          value: function setMeta(meta) {
            this.meta = meta;
          }
        }, {
          key: 'getMeta',
          value: function getMeta() {
            return this.meta;
          }
        }, {
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
          key: 'getJsonRootObject',
          value: function getJsonRootObject() {
            var entity = this.getNewEntity();
            var jsonRoot = entity.getMeta().fetch('jsonRoot');

            return jsonRoot ? jsonRoot : this.resource;
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

<<<<<<< HEAD
            var collection = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

=======
>>>>>>> SpoonX/master
            var findQuery = this.getTransport().find(path, criteria);

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
                return populated.markClean();
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
            return this.getTransport().find(this.resource + '/count', criteria);
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

              if (entityMetadata.has('types', key)) {
                populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

                continue;
              }

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

              if (assocMeta.type !== 'entity' || !assocMeta.populateOnCreate) {
                continue;
              }

              entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
            }

            return entity;
          }
        }, {
          key: 'jsonRootObjectSingle',
          get: function get() {
            var jsonRoot = this.getJsonRootObject();
            jsonRoot = typeof jsonRoot === 'object' ? jsonRoot.single : jsonRoot;

            return stringToCamelCase(jsonRoot.replace(/s$/, ''));
          }
        }, {
          key: 'jsonRootObjectPlural',
          get: function get() {
            var jsonRoot = this.getJsonRootObject();
            jsonRoot = typeof jsonRoot === 'object' ? jsonRoot.plural : jsonRoot;

            return stringToCamelCase(jsonRoot);
          }
        }]);

        var _Repository = Repository;
        Repository = inject(Config)(Repository) || Repository;
        return Repository;
      })();

      _export('Repository', Repository);
    }
  };
});