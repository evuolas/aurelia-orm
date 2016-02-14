import {HasAssociationValidationRule} from '../../src/validator/has-association';
import {WithAssociationValidation} from '../resources/entity/with-association-validation';
import {Container} from 'aurelia-dependency-injection';
import {EntityManager, configure} from '../../src/index';
import {ValidationResultProperty} from 'aurelia-validation';

function getEntityManager() {
  var entityManager = new EntityManager(new Container());

  return entityManager.registerEntities([WithAssociationValidation]);
}

function noop() {
}

describe('HasAssociationValidationRule', function() {
  describe('.validate()', function() {
    it('Validate entity association values properly and fail.', function(done) {
      var container     = new Container();
      var entityManager = new EntityManager(container);

      configure({container: container, globalResources: noop}, function() {
      });

      entityManager.registerEntities([WithAssociationValidation]);

      let entity = entityManager.getRepository('assoc-validation').getNewEntity();

      entity.getValidation().validate()
        .then(() => {
          done.fail('Validation should have failed');
        })
        .catch(function(e) {
          expect(e.isValid).toBe(false);
          expect(e.properties.foo instanceof ValidationResultProperty).toBe(true);
          done();
        });
    });

    it('Validate entity association values properly.', function(done) {
      var container     = new Container();
      var entityManager = new EntityManager(container);

      configure({container: container, globalResources: noop}, function() {
      });

      entityManager.registerEntities([WithAssociationValidation]);

      let entity = entityManager.getRepository('assoc-validation').getNewEntity();

      entity.foo = 5;

      entity.getValidation().validate()
        .then(result => {
          expect(result.isValid).toBe(true);
          done();
        })
        .catch(function(e) {
          done.fail('Validation should not fail');
        });
    });
  });

  it('Validate entity association values properly for actual association with value.', function(done) {
    var container     = new Container();
    var entityManager = new EntityManager(container);

    configure({container: container, globalResources: noop}, function() {
    });

    entityManager.registerEntities([WithAssociationValidation]);

    let entity = entityManager.getRepository('assoc-validation').getNewPopulatedEntity();

    entity.foo.setData({id: 5});

    entity.getValidation().validate()
      .then(result => {
        expect(result.isValid).toBe(true);
        done();
      })
      .catch(function(e) {
        done.fail('Validation should not fail');
      });
  });

  it('Validate entity association values properly and fail for actual association without value.', function(done) {
    var container     = new Container();
    var entityManager = new EntityManager(container);

    configure({container: container, globalResources: noop}, function() {});

    entityManager.registerEntities([WithAssociationValidation]);

    let entity = entityManager.getRepository('assoc-validation').getNewPopulatedEntity();

    entity.getValidation().validate()
      .then(result => {
        done.fail('Validation should have failed');
      })
      .catch(function(e) {
        expect(e.isValid).toBe(false);
        expect(e.properties.foo instanceof ValidationResultProperty).toBe(true);
        done();
      });
  });
});
