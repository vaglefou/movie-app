import { Router } from "express";
import { signUpUser, signInUser, getLoggedInUser } from "../controllers/auth.controller";
import UserRoles from "../constants/user-roles";
const { authMiddleware } = require("../middleware/auth.middleware");
const { roleBaseAuthMiddleware } = require("../middleware/rolebase-auth.middleware");

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Sign up a new user
 *     description: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "demoUser"
 *               email: "testmail01@example.com"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 */
router.post("/sign-up", signUpUser);

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "testmail01@example.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized (invalid credentials)
 */
router.post("/sign-in", signInUser);

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get logged-in user details
 *     description: Retrieve details of the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  getLoggedInUser
);

export default router;