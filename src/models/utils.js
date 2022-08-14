/**
 * A mongoose schema plugin which applies the following in the toJSON transform call
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 * @param {*} schema
 */
const toJSON = (schema) => {
  let transform;
  // When the object is called by toJSON, the transform method invoked as well
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        transform(doc, ret, options);
      }
    },
  });
};

module.exports = {
  toJSON,
};
