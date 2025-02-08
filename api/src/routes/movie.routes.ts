import { Router } from "express";
import { getAllMovies } from "../controllers/movie.controller";
import UserRoles from "../constants/user-roles";
const { authMiddleware } = require("../middleware/auth.middleware");
const {roleBaseAuthMiddleware } = require("../middleware/rolebase-auth.middleware");

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Inception"
 *         releaseYear:
 *           type: integer
 *           example: 2010
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /movie:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies (Admin or User only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 */
router.get(
  "/",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  getAllMovies
);

export default router;
