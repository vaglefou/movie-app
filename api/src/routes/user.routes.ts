import { Router } from "express";
import { getAllUsers, getSingleUser, deleteUser } from "../controllers/user.controller";
import UserRoles from "../constants/user-roles";
const { authMiddleware } = require("../middleware/auth.middleware");
const { roleBaseAuthMiddleware } = require("../middleware/rolebase-auth.middleware");

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 */
router.get(
  "/",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN]),
  getAllUsers
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Retrieve details of a specific user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN]),
  getSingleUser
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a specific user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN]),
  deleteUser
);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: The user's role
 *       example:
 *         id: "12345"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         role: "USER"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;