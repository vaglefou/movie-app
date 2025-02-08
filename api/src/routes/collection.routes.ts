import { Router } from "express";
import {createCollection,  getAllCollections,  getCollectionById,  deleteCollection,  addMovieToCollection,  getCollectionMovieList,  deleteMovieToCollection,
} from "../controllers/collection.controller";
import UserRoles from "../constants/user-roles";
const { authMiddleware } = require("../middleware/auth.middleware");
const { roleBaseAuthMiddleware } = require("../middleware/rolebase-auth.middleware");

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Movie collection management
 */

/**
 * @swagger
 * /collection:
 *   post:
 *     summary: Create a new collection
 *     description: Create a new movie collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *               "name": "My favorite drama films"
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       201:
 *         description: Collection created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 */
router.post(
  "/",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  createCollection
);

/**
 * @swagger
 * /collection:
 *   get:
 *     summary: Get all collections
 *     description: Retrieve a list of all collections (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of collections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 */
router.get(
  "/",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  getAllCollections
);

/**
 * @swagger
 * /collection/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     description: Retrieve details of a specific collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: Collection details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 *       404:
 *         description: Collection not found
 */
router.get(
  "/:id",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  getCollectionById
);

/**
 * @swagger
 * /collection/{id}:
 *   delete:
 *     summary: Delete a collection
 *     description: Delete a specific collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 *       404:
 *         description: Collection not found
 */
router.delete(
  "/:id",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  deleteCollection
);

/**
 * @swagger
 * /collection/{collectionId}/movie:
 *   post:
 *     summary: Add a movie to a collection
 *     description: Add a movie to a specific collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *             example:
 *               movieId: "12345"
 *     responses:
 *       200:
 *         description: Movie added to collection successfully
 *       400:
 *         description: Bad request (e.g., missing movieId)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 *       404:
 *         description: Collection or movie not found
 */
router.post(
  "/:collectionId/movie",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  addMovieToCollection
);

/**
 * @swagger
 * /collection/{collectionId}/movie:
 *   get:
 *     summary: Get movies in a collection
 *     description: Retrieve a list of movies in a specific collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: A list of movies in the collection
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
 *       404:
 *         description: Collection not found
 */
router.get(
  "/:collectionId/movie",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  getCollectionMovieList
);

/**
 * @swagger
 * /collection/{collectionId}/movie/{movieId}:
 *   delete:
 *     summary: Remove a movie from a collection
 *     description: Remove a movie from a specific collection (Admin or User only)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie removed from collection successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin or user)
 *       404:
 *         description: Collection or movie not found
 */
router.delete(
  "/:collectionId/movie/:movieId",
  authMiddleware,
  roleBaseAuthMiddleware([UserRoles.ADMIN, UserRoles.USER]),
  deleteMovieToCollection
);

export default router;