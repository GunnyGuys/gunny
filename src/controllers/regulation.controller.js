const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { regulationService } = require("../services");

const createRegulation = catchAsync(async (req, res) => {
  req.body.agency = req.params.agencyId;
  const regulation = await regulationService.createRegulation(req.body);
  res.status(httpStatus.CREATED).send(regulation);
});

const getRegulations = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const regulations = await regulationService.queryRegulations(
    { agency: req.params.agencyId },
    options
  );
  res.send(regulations);
});

const getRegulation = catchAsync(async (req, res) => {
  const regulation = await regulationService.getRegulationById(
    req.params.regulationId
  );
  if (!regulation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
  }
  if (!regulation.contractor.equals(req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  res.send(agency);
});

const updateRegulation = catchAsync(async (req, res) => {
  const regulation = await regulationService.updateRegulationById(
    req.params.agencyId,
    req.user._id,
    req.body
  );
  res.send(regulation);
});

const updateRegulations = catchAsync(async (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    await regulationService.updateRegulationById(
      req.params.agencyId,
      req.user._id,
      req.body[i]
    );
  }
  res.status(httpStatus.OK).send();
});

const deleteRegulation = catchAsync(async (req, res) => {
  await regulationService.deleteAgencyById(req.params.agencyId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRegulation,
  getRegulations,
  getRegulation,
  updateRegulation,
  updateRegulations,
  deleteRegulation,
};
