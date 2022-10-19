const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const agencyRoute = require("./agency.route");
const messageRoute = require("./message.route");
const lotteryRoute = require("./lottery.route");
const docsRoute = require("./docs.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/agencies", agencyRoute);
router.use("/messages", messageRoute);
router.use("/lottery", lotteryRoute);
router.use("/docs", docsRoute);

module.exports = router;
