const httpStatus = require("http-status");
const { Agency } = require("../models");
const Regulation = require("../models/regulation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create a regulation
 * @param {Object} regulationBody
 * @returns {Promise<Regulation>}
 */
const createRegulation = async (regulationBody) => {
  return Regulation.create(regulationBody);
};

/**
 * Query for regulations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRegulations = async (filter, options) => {
  const regulations = await Regulation.paginate(filter, options);
  return regulations;
};

/**
 * Get regulation by id
 * @param {ObjectId} id
 * @returns {Promise<Agency>}
 */
const getRegulationById = async (id) => {
  return Regulation.findById(id);
};

/**
 * Update regulation by id
 * @param {ObjectId} regulationId
 * @param {Object} updateBody
 * @returns {Promise<Agency.Agency>}
 */
const updateRegulationById = async (regulationId, userId, updateBody) => {
  const regulation = await getRegulationById(regulationId);
  if (!regulation.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (!regulation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  Object.assign(regulation, updateBody);
  await regulation.save();
  return regulation;
};

/**
 * Delete regulation by id
 * @param {ObjectId} regulationId
 * @returns {Promise<Agency>}
 */
const deleteRegulationById = async (regulationId, userId) => {
  const regulation = await getRegulationById(regulationId);
  if (!regulation.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (!regulation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  await regulation.remove();
  return regulation;
};

module.exports = {
  createRegulation,
  queryRegulations,
  getRegulationById,
  updateRegulationById,
  deleteRegulationById,
};
