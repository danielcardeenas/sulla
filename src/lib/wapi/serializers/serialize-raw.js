/**
 * Serializes object into JSON format safely
 * @param {*} obj
 */
export const _serializeRawObj = (obj) => {
  if (obj && obj.toJSON) {
    return obj.toJSON();
  }
  return {};
};
