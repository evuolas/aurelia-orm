System.register([], function (_export) {
  "use strict";

  _export("stringToCamelCase", stringToCamelCase);

  function stringToCamelCase(str) {
    return str.replace(/(_\w)/g, function (m) {
      return m[1].toUpperCase();
    });
  }

  return {
    setters: [],
    execute: function () {}
  };
});