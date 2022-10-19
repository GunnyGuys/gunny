const express = require("express");
const validate = require("../../middlewares/validate");
const lotteryValidation = require("../../validations/lottery.validation");
const lotteryController = require("../../controllers/lottery.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/:dealer/:date")
  .get(
    auth("getUsers"),
    validate(lotteryValidation.getLottery),
    lotteryController.getLottery
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Lottery
 *   description: Lottery management and retrieval
 */

/**
 * @swagger
 * /lottery/{dealer}/{date}:
 *   get:
 *     summary: Get result of lottery by dealer and date
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Lottery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dealer
 *         required: true
 *         schema:
 *           type: string
 *         description: mien-nam/mien-trung/mien-bac
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Có dạng DD-MM-YYYY (Ngày muốn lấy kết quả)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lottery'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
