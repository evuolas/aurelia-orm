'use strict';

System.register(['../aurelia-orm', 'aurelia-binding', 'aurelia-templating'], function (_export, _context) {
  "use strict";

  var logger, bindingMode, bindable, customElement, _typeof, _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, Paged;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  return {
    setters: [function (_aureliaOrm) {
      logger = _aureliaOrm.logger;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_aureliaTemplating) {
      bindable = _aureliaTemplating.bindable;
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _export('Paged', Paged = (_dec = customElement('paged'), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = function () {
        function Paged() {
          _classCallCheck(this, Paged);

          _initDefineProp(this, 'data', _descriptor, this);

          _initDefineProp(this, 'page', _descriptor2, this);

          _initDefineProp(this, 'error', _descriptor3, this);

          _initDefineProp(this, 'criteria', _descriptor4, this);

          _initDefineProp(this, 'repository', _descriptor5, this);

          _initDefineProp(this, 'resource', _descriptor6, this);

          _initDefineProp(this, 'limit', _descriptor7, this);
        }

        Paged.prototype.attached = function attached() {
          if (!this.page) {
            this.page = 1;
          }

          if (!this.criteria) {
            this.criteria = {};
          }

          this.reloadData();
        };

        Paged.prototype.reloadData = function reloadData() {
          this.getData();
        };

        Paged.prototype.isChanged = function isChanged(property, newVal, oldVal) {
          return !this[property] || !newVal || newVal === oldVal;
        };

        Paged.prototype.pageChanged = function pageChanged(newVal, oldVal) {
          if (this.isChanged('resource', newVal, oldVal) || this.isChanged('criteria', newVal, oldVal)) {
            return;
          }

          this.reloadData();
        };

        Paged.prototype.resourceChanged = function resourceChanged(newVal, oldVal) {
          if (this.isChanged('resource', newVal, oldVal)) {
            return;
          }

          this.reloadData();
        };

        Paged.prototype.criteriaChanged = function criteriaChanged(newVal, oldVal) {
          if (this.isChanged('criteria', newVal, oldVal)) {
            return;
          }

          this.reloadData();
        };

        Paged.prototype.resourceChanged = function resourceChanged(resource) {
          if (!resource) {
            logger.error('resource is ' + (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) + '. It should be a string or a reference');
          }

          this.repository = this.entityManager.getRepository(resource);
        };

        Paged.prototype.getData = function getData() {
          var _this = this;

          var criteria = JSON.parse(JSON.stringify(this.criteria));

          criteria.skip = this.page * this.limit - this.limit;
          criteria.limit = this.limit;
          this.error = null;

          this.repository.find(criteria, true).then(function (result) {
            _this.data = result;
          }).catch(function (error) {
            _this.error = error;
          });
        };

        return Paged;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_dec2], {
        configurable: true,
        enumerable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'page', [_dec3], {
        configurable: true,
        enumerable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'error', [_dec4], {
        configurable: true,
        enumerable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [bindable], {
        configurable: true,
        enumerable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
        configurable: true,
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'resource', [bindable], {
        configurable: true,
        enumerable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'limit', [bindable], {
        configurable: true,
        enumerable: true,
        initializer: function initializer() {
          return 30;
        }
      })), _class2)) || _class));

      _export('Paged', Paged);
    }
  };
});