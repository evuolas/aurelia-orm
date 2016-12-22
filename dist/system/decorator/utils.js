'use strict';

System.register(['../aurelia-orm'], function (_export, _context) {
  "use strict";

  var logger;
  function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
    if (descriptor && descriptor.configurable === false) {
      descriptor.configurable = true;

      if (!Reflect.defineProperty(target, propertyName, descriptor)) {
        logger.warn('Cannot make configurable property \'' + propertyName + '\' of object', target);
      }
    }
  }

  _export('ensurePropertyIsConfigurable', ensurePropertyIsConfigurable);

  return {
    setters: [function (_aureliaOrm) {
      logger = _aureliaOrm.logger;
    }],
    execute: function () {}
  };
});