const httpStatus = require("http-status");
const { Agency } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a agency
 * @param {Object} agencyBody
 * @returns {Promise<Agency.Agency>}
 */
const createAgency = async (agencyBody) => {
  return Agency.create(agencyBody);
};

/**
 * Query for agencies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAgencies = async (filter, options) => {
  const agencies = await Agency.paginate(filter, options);
  return agencies;
};

/**
 * Get agency by id
 * @param {ObjectId} id
 * @returns {Promise<Agency>}
 */
const getAgencyById = async (id) => {
  return Agency.findById(id);
};

/**
 * Update agency by id
 * @param {ObjectId} agencyId
 * @param {Object} updateBody
 * @returns {Promise<Agency.Agency>}
 */
const updateAgencyById = async (agencyId, userId, updateBody) => {
  const agency = await getAgencyById(agencyId);
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  Object.assign(agency, updateBody);
  await agency.save();
  return agency;
};

/**
 * Delete agency by id
 * @param {ObjectId} agencyId
 * @returns {Promise<Agency>}
 */
const deleteAgencyById = async (agencyId, userId) => {
  const agency = await getAgencyById(agencyId);
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  await agency.remove();
  return agency;
};

module.exports = {
  createAgency,
  queryAgencies,
  getAgencyById,
  updateAgencyById,
  deleteAgencyById,
};
