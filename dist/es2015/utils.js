export function stringToCamelCase(str) {
  return str.replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}