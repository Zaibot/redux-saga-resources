export const internal = (id) => `@@saga-resources/${id}`;
export const isInternal = (id) => /^@@saga-resources\//.test(id);
