const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { lotteryService } = require("../services");

const getLottery = catchAsync(async (req, res) => {
  const result = await lotteryService.getLottery(
    req.params.dealer,
    req.params.date
  );
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  getLottery,
};
