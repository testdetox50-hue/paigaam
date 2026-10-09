export const requireFields = (obj, fields) =>
  fields.filter((f) => obj[f] === undefined || obj[f] === null);
