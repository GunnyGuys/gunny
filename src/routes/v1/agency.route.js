const express = require("express");
const validate = require("../../middlewares/validate");
const agencyValidation = require("../../validations/agency.validation");
const agencyController = require("../../controllers/agency.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(
    auth("getUsers"),
    validate(agencyValidation.createAgency),
    agencyController.createAgency
  )
  .get(
    auth("getUsers"),
    validate(agencyValidation.getAgencies),
    agencyController.getAgencies
  );

router
  .route("/:agencyId")
  .get(
    auth("getUsers"),
    validate(agencyValidation.getAgency),
    agencyController.getAgency
  )
  .patch(
    auth("getUsers"),
    validate(agencyValidation.updateAgency),
    agencyController.updateAgency
  )
  .delete(
    auth("getUsers"),
    validate(agencyValidation.deleteAgency),
    agencyController.deleteAgency
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Agencies
 *   description: Agency management and retrieval
 */

/**
 * @swagger
 * /agencies:
 *   post:
 *     summary: Create a agency
 *     description: Only contractors and admins can create other agencies.
 *     tags: [Agencies]
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
 *               - deOrRe
 *               - type
 *               - isAlert
 *               - syntax
 *               - calKI
 *               - divide
 *               - northern
 *               - central
 *               - south
 *             properties:
 *               name:
 *                 type: string
 *               deOrRe:
 *                 type: boolean
 *                 description: Define agency is deliver or receiver
 *               type:
 *                 type: boolean
 *                 description: Define agency type
 *               isAlert:
 *                 type: boolean
 *                 description: Using for alert purpose
 *               syntax:
 *                 type: string
 *                 description: Play type
 *               calKI:
 *                  type: number
 *                  description: calculate KI
 *               divide:
 *                  type: string
 *                  description: Percentage divided by agency
 *               northern:
 *                  type: string
 *                  description: Reward configuration
 *               central:
 *                  type: string
 *                  description: Reward configuration
 *               south:
 *                  type: string
 *                  description: Reward configuration
 *             example:
 *               name: nguyenvanco
 *               deOrRe: true
 *               type: true
 *               isAlert: true
 *               syntax: DSK
 *               calKI: 0
 *               divide: 0,0,0
 *               northern: 75.5,75.5,66.0,66.0,75.5,75.5,66.0,66.0,66.0,75,75,650,6000,680,75,650,650,6000
 *               central: 75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550
 *               south: 75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Agency'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all agencies
 *     description: Only contractors and admins can retrieve all agencies.
 *     tags: [Agencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Maximum number of agencies
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
 *                     $ref: '#/components/schemas/Agency'
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
 * /agencies/{id}:
 *   get:
 *     summary: Get a agency
 *     description: Logged in contractor can fetch only their own agency information. Only contractors and admins can fetch other users.
 *     tags: [Agencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agency id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Agency'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a agency
 *     description: Logged in contractor can only update their own information. Only contractors and admins can update other users.
 *     tags: [Agencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agency id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               deOrRe:
 *                 type: boolean
 *                 description: Define agency is deliver or receiver
 *               type:
 *                 type: boolean
 *                 description: Define agency type
 *               isAlert:
 *                 type: boolean
 *                 description: Using for alert purpose
 *               syntax:
 *                 type: string
 *                 description: Play type
 *               calKI:
 *                  type: number
 *                  description: calculate KI
 *               divide:
 *                  type: number
 *                  description: Percentage divided by agency
 *               northern:
 *                  type: string
 *                  description: Reward configuration
 *               central:
 *                  type: string
 *                  description: Reward configuration
 *               south:
 *                  type: string
 *                  description: Reward configuration
 *             example:
 *               name: nguyenvanco
 *               deOrRe: true
 *               type: true
 *               isAlert: true
 *               syntax: DSK
 *               calKI: 0
 *               divide: 0,0,0
 *               northern: 75.5,75.5,66.0,66.0,75.5,75.5,66.0,66.0,66.0,75,75,650,6000,680,75,650,650,6000
 *               central: 75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550
 *               south: 75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Agency'
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
 *     summary: Delete a agency
 *     description: Logged in contractor can delete only themselves. Only contractors and admins can delete other users.
 *     tags: [Agencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agency id
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
