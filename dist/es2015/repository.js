var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { Config } from 'aurelia-api';
import { stringToCamelCase } from './utils';
import typer from 'typer';

export let Repository = (_dec = inject(Config), _dec(_class = class Repository {
  constructor(clientConfig) {
    this.enableRootObjects = true;
    this.transport = null;

    this.clientConfig = clientConfig;
  }

  getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error(`No transport found for '${this.getMeta().fetch('endpoint') || 'default'}'.`);
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
}) || _class);