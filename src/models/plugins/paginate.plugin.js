const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filters, options) {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filters).exec();
    let docsPromise = this.find(filters).sort(sort).skip(skip).limit(limit);

    /**
     * format { path: param1, populate: param2 } using
     * when need a nested populate, for example
     * Student:
     * {
     *    name: "Student1",
     *    age: 19,
     *    course:{
     *      lesson: [Array],
     *       name: 'Course1',
     *       teacher: '5eeccbrfdbghejkrdhjk3466',
     *    }
     * }
     * Student.find()
     * .populate('course)
     * .populate({path: 'course, populate: 'teacher' })
     */
    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split(".")
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }
    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;

// School:
//  {
//     name: "SPKT",
//     address: 'Vo Van Ngan',
//     class:{
//        name: 'classA',
//        student: '5eeccbrfdbghejkrdhjk3466',
//     }
//  }

// const array1 = ['School','Class', 'Student'];
// const result = array1.reverse().reduce(
//   (a, b) =>{
//     console.log(a);
//     console.log(b);
//     return { 'path': b, 'populate': a }
//   }
// );

// > "Student"
// > "Class"
// > Object { path: "Class", populate: "Student" }
// > "School"
// > Object { path: "School", populate: Object { path: "Class", populate: "Student" } }
