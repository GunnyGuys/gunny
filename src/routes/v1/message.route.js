const express = require("express");
const validate = require("../../middlewares/validate");
const messageValidation = require("../../validations/message.validation");
const messageController = require("../../controllers/message.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(
    auth("getUsers"),
    validate(messageValidation.createMessage),
    messageController.createMessage
  )
  .get(
    auth("getUsers"),
    validate(messageValidation.getMessages),
    messageController.getMessages
  );

router
  .route("/import-messages")
  .post(
    auth("getUsers"),
    validate(messageValidation.createMessages),
    messageController.createMessages
  );

router
  .route("/:messageId")
  .get(
    auth("getUsers"),
    validate(messageValidation.getMessage),
    messageController.getMessage
  )
  .patch(
    auth("getUsers"),
    validate(messageValidation.updateMessage),
    messageController.updateMessage
  )
  .delete(
    auth("getUsers"),
    validate(messageValidation.deleteMessage),
    messageController.deleteMessage
  );

router
  .route("/check-win/:messageId")
  .post(
    auth("getUsers"),
    validate(messageValidation.checkMessage),
    messageController.checkWin
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management and retrieval
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a message
 *     description: Only contractors and admins can create other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - customerName
 *               - check
 *               - agency
 *               - dealer
 *               - numbers
 *               - type
 *               - bet
 *               - capital
 *               - win
 *               - winNumbers
 *               - profit
 *               - loss
 *             properties:
 *               name:
 *                 type: string
 *               customerName:
 *                 type: string
 *                 description: Define agency name
 *               check:
 *                 type: number
 *               agency:
 *                 type: string
 *                 description: AgencyId of message
 *               dealer:
 *                 type: string
 *               numbers:
 *                 type: string
 *               type:
 *                  type: string
 *               bet:
 *                  type: number
 *               capital:
 *                  type: number
 *               win:
 *                  type: boolean
 *               winNumbers:
 *                  type: string
 *               profit:
 *                  type: number
 *               loss:
 *                  type: number
 *             example:
 *               name: Tin1
 *               customerName: nguyenvanco
 *               check: 0
 *               agency: 630990d8ff507a87c891f78d
 *               dealer: dc
 *               numbers: 02 03 04
 *               type: dt
 *               bet: 0
 *               capital: 0
 *               win: false
 *               winNumbers: 02 03
 *               profit: 0
 *               loss: 0
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all messages
 *     description: Only contractors and admins can retrieve all messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agency
 *         schema:
 *           type: string
 *         description: AgencyId if message
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Messages'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message
 *     description: Logged in contractor can fetch only their own message information. Only contractors and admins can fetch other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a message
 *     description: Logged in contractor can only update their own information. Only contractors and admins can update other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               customerName:
 *                 type: string
 *                 description: Define agency name
 *               check:
 *                 type: number
 *               agency:
 *                 type: string
 *                 description: AgencyId of message
 *               dealer:
 *                 type: string
 *               numbers:
 *                 type: string
 *               type:
 *                  type: string
 *               bet:
 *                  type: number
 *               capital:
 *                  type: number
 *               win:
 *                  type: boolean
 *               winNumbers:
 *                  type: string
 *               profit:
 *                  type: number
 *               loss:
 *                  type: number
 *               confirmed:
 *                  type: boolean
 *             example:
 *               name: Tin1
 *               customerName: nguyenvanco
 *               check: 0
 *               agency: 630990d8ff507a87c891f78d
 *               dealer: dc
 *               numbers: 02 03 04
 *               type: dt
 *               bet: 0
 *               capital: 0
 *               win: false
 *               winNumbers: 02 03
 *               profit: 0
 *               loss: 0
 *               confirmed: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a message
 *     description: Logged in contractor can delete only themselves. Only contractors and admins can delete other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /messages/check-win/{id}:
 *   post:
 *     summary: Check a message whether win or not
 *     description: Logged in contractor can check only their own message information. Only contractors and admins can check other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /messages/import-messages:
 *   post:
 *     summary: Create messages
 *     description: Only contractors and admins can create other messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
