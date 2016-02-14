define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.stringToCamelCase = stringToCamelCase;

  function stringToCamelCase(str) {
    return str.replace(/(_\w)/g, function (m) {
      return m[1].toUpperCase();
    });
  }
});