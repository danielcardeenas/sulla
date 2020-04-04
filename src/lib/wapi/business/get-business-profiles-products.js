/**
 * Find any product listings of the given number. Use this to query a catalog
 *
 * @param id id of buseinss profile (i.e the number with @c.us)
 * @param done Optional callback function for async execution
 * @returns None
 */
window.WAPI.getBusinessProfilesProducts = function (id, done) {
  return Store.Catalog.find(id)
    .then((resp) => {
      if (resp.msgProductCollection && resp.msgProductCollection._models.length)
        done();
      return resp.productCollection._models;
    })
    .catch((error) => {
      done();
      return error.model._products;
    });
};
