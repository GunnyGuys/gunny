const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { removeAscent } = require("../utils/stringUtils");
const { agencyService } = require("../services");

const createAgency = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  req.body.contractor = req.user._id;
  const agency = await agencyService.createAgency(req.body);
  res.status(httpStatus.CREATED).send(agency);
});

const getAgencies = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  let filters = pick(req.query, ["name"]);
  if (filters.name) {
    filters.name = removeAscent(filters.name);
    filters.name = { $regex: ".*" + filters.name + ".*" };
  }
  filters.contractor = req.user._id;
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const agencies = await agencyService.queryAgencies(filters, options);
  res.send(agencies);
});

const getAgency = catchAsync(async (req, res) => {
  const agency = await agencyService.getAgencyById(req.params.agencyId);
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  if (!agency.contractor.equals(req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  res.send(agency);
});

const updateAgency = catchAsync(async (req, res) => {
  const agency = await agencyService.updateAgencyById(
    req.params.agencyId,
    req.user._id,
    req.body
  );
  res.send(agency);
});

const deleteAgency = catchAsync(async (req, res) => {
  await agencyService.deleteAgencyById(req.params.agencyId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAgency,
  getAgencies,
  getAgency,
  updateAgency,
  deleteAgency,
};
