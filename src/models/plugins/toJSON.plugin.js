/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
  // end of path
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          // delete ret[path];
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

module.exports = toJSON;

// Subdocument
// const userSchema = new Schema({
//   child: new mongoose.Schema({
//     name: {
//       type: String,
//       required: true,
//       private: true
//     },
//     age:{
//       type: Number,
//       private: true
//     },
//   })
// });

// Nested Paths
// const userSchema = new Schema({
//     child: {
//       name: {
//         type: String,
//         required: true,
//         private: true
//       },
//       age:{
//         type: Number,
//         private: true
//       },
//   }
// });

// const User = mongoose.model('User', userSchema);
// const Parent = mongoose.model('Parent', parentSchema);

// const deleteAtPath = (obj, path, index) => {
//     if (index === path.length - 1) {
//       const key = path[index]
//       delete obj[key];
//       return;
//     }
//     deleteAtPath(obj[path[index]], path, index + 1);
//   };
