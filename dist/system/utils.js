"use strict";

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      function stringToCamelCase(str) {
        return str.replace(/(_\w)/g, function (m) {
          return m[1].toUpperCase();
        });
      }

      _export("stringToCamelCase", stringToCamelCase);
    }
  };
});