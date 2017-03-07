export const internal = (id: string) => `@@saga-resources/${id}`;
export const isInternal = (id: string) => /^@@saga-resources\//.test(id);
