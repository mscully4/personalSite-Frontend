export const objectKeysSnakeCasetoCamelCase = (obj: object) => {
  const processVal = (val) =>
    typeof val !== "object"
      ? val
      : Array.isArray(val)
      ? val.map(objectKeysSnakeCasetoCamelCase)
      : objectKeysSnakeCasetoCamelCase(val);

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.replace(/_(.)/g, (g) => g[1].toUpperCase()),
      processVal(val),
    ])
  );
};

export const objectKeysCamelCaseToSnakeCase = (obj: object) => {
  const processVal = (val) =>
    typeof val !== "object"
      ? val
      : Array.isArray(val)
      ? val.map(objectKeysCamelCaseToSnakeCase)
      : objectKeysCamelCaseToSnakeCase(val);

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      processVal(val),
    ])
  );
};
