"use strict";

System.register([], function (_export, _context) {
  "use strict";

  function stringToCamelCase(str) {
    return str.replace(/(_\w)/g, function (m) {
      return m[1].toUpperCase();
    });
  }

  _export("stringToCamelCase", stringToCamelCase);

  return {
    setters: [],
    execute: function () {}
  };
});