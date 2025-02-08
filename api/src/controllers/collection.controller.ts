  import { Request, Response } from "express";
  import UserSchema from "../models/user.model";
  import CollectionSchema from "../models/collection.model";
  import UserCollectionSchema from "../models/user-collection.model";
  import { BaseResponse,fromFailed,fromSuccess } from "../common/utils/base-response.utils";
  import { IAddMovieToCollection, ICreateCollection, } from "../common/types/collection.types";
  import { AuthenticatedRequest } from "../common/types/middleware-request.types";


    /**
   * @Description  - Create a new collection
   * @Route        - POST /api/collection
   * @Access       - Private
   * @RequestBody  - { name: string }
   * @Response     - Success response with created collection or failure message
   * 
   * This controller allows an authenticated user to create a new collection by providing a name.
   * It validates the user's identity and ensures that all required fields are present. If successful, 
   * the collection is saved to the database and a success response with the created collection is returned. 
   * Otherwise, a failure message is returned.
   */
  export const createCollection = async (
    req: AuthenticatedRequest,
    res: Response 
  ): Promise<void> => {
    try {
      const { name }: ICreateCollection = req.body;

      // Validate the required field
      if (!name) {
        const responseObj: BaseResponse = fromFailed(
          "Please fill required fields"
        );
        res.status(400).json(responseObj);
        return;
      }

      // Validate the user
      const user = await UserSchema.findOne({ _id: req?.user?.id });
      if (!user) {
        const responseObj: BaseResponse = fromFailed("User not found");
        res.status(404).json(responseObj);
        return;
      }

      // Create a new collection
      const createdCollection = await CollectionSchema.create({
        name,
        createdBy: user._id,
      });

      // Send the success response
      const responseObj: BaseResponse = fromSuccess(
        "Collection created successfully",
        createdCollection
      );
      res.status(201).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed("Failed to create collection");
      res.status(500).json(responseObj);

      console.error("Error in createCollection:", error.message);
    }
  };


    /**
   * @Description  - Get all collections created by the logged-in user
   * @Route        - GET /api/collection
   * @Access       - Private
   * @QueryParams  - { page: string, take: string, search: string }
   * @Response     - Success response with collection list and pagination info or failure message
   * 
   * This controller retrieves all collections created by the logged-in user. It supports pagination and 
   * searching by collection name. The response includes the collection list along with pagination details 
   * like total pages, current page, and total collections. If no collections are found, a success message 
   * with an empty list is returned.
   */
  export const getAllCollections = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      // Ensure the user is authenticated
      const userId = req?.user?.id;

      if (!userId) {
        const responseObj: BaseResponse = fromFailed("User is not authenticated");
        res.status(401).json(responseObj);
        return;
      }

      // Get query parameters for pagination and search
      const { page = "1", take = "10", search = "" } = req.query;

      // Convert page and size to integers
      const currentPage = parseInt(page as string, 10);
      const pageSize = parseInt(take as string, 10);

      // Validate currentPage and pageSize values
      if (isNaN(currentPage) || isNaN(pageSize)) {
        const responseObj: BaseResponse = fromFailed(
          "Invalid page or size values"
        );
        res.status(400).json(responseObj);
        return;
      }

      // Build the search query for the collection name 
      let searchFilter = {};
      if (search) {
        searchFilter = { name: { $regex: search, $options: "i" } }; 
      }

      // Find collections with pagination and search
      const collections = await CollectionSchema.find({
        createdBy: userId,
        ...searchFilter, 
      })
        .skip((currentPage - 1) * pageSize) // Skip documents for pagination
        .limit(pageSize); // Limit to the page size

      // Count the total number of collections matching the search filter
      const totalCollections = await CollectionSchema.countDocuments({
        createdBy: userId,
        ...searchFilter,
      });

      // If no collections are found, return a message
      if (!collections.length) {
        const responseObj: BaseResponse = fromSuccess("No collections found", []);
        res.status(200).json(responseObj);
        return;
      }

      // Send the success response with the collections and pagination info
      const responseObj: BaseResponse = fromSuccess(
        "Collections retrieved successfully",
        {
          items: collections,
          pageInfo: {
            totalPages: Math.ceil(totalCollections / pageSize),
            currentPage,
            totalCollections,
          },
        }
      );
      res.status(200).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed(
        "Failed to retrieve collections"
      );
      res.status(500).json(responseObj);

      // Log the error for debugging purposes
      console.error("Error in getAllCollections:", error.message);
    }
  };

    /**
   * @Description  - Get a collection by its ID
   * @Route        - GET /api/collection/:id
   * @Access       - Private
   * @Response     - Success response with collection details or failure message
   * 
   * This controller fetches the collection details by its ID. If the collection exists, 
   * it returns the collection details. If the collection does not exist, a failure message 
   * is returned.
   */

  export const getCollectionById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      // Validate the ID
      if (!id) {
        const responseObj: BaseResponse = fromFailed("Collection ID is required");
        res.status(400).json(responseObj);
        return;
      }

      // Fetch the collection by ID
      const collection = await CollectionSchema.findById(id);

      // If no collection is found, return an error
      if (!collection) {
        const responseObj: BaseResponse = fromFailed(
          `No collection found with ID: ${id}`
        );
        res.status(404).json(responseObj);
        return;
      }

      // Send the success response with the collection details
      const responseObj: BaseResponse = fromSuccess(
        "Collection retrieved successfully",
        collection
      );
      res.status(200).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed(
        "Failed to retrieve collection"
      );
      res.status(500).json(responseObj);

      // Log the error for debugging purposes
      console.error("Error in getCollectionById:", error.message);
    }
  };

    /**
   * @Description  - Delete a collection
   * @Route        - DELETE /api/v1/collection/:id
   * @Access       - Private
   * @Response     - Success response with deletion confirmation or failure message
   * 
   * This controller handles the deletion of a collection and its associated movies. It ensures that only 
   * the owner of the collection can delete it. If successful, a success message is returned confirming the 
   * deletion. If the collection doesn't exist or the user is unauthorized, a failure message is returned.
   */
  export const deleteCollection = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const collectionId: string = req.params.id;

      // Check if the collection exists
      const existingCollection = await CollectionSchema.findOne({
        _id: collectionId,
      });

      if (!existingCollection) {
        const responseObj: BaseResponse = fromFailed("Collection not found");
        res.status(404).json(responseObj);
        return;
      }

      // Ensure the user is authorized to delete the collection
      if (existingCollection.createdBy.toString() !== req.user?.id) {
        const responseObj: BaseResponse = fromFailed("Unauthorized action");
        res.status(403).json(responseObj);
        return;
      }

      // Delete associated movies in UserCollectionSchema
      await UserCollectionSchema.deleteMany({
        attachedCollection: collectionId,
      });

      // Delete the collection from MongoDB
      await CollectionSchema.deleteOne({ _id: collectionId });

      // Send success response
      const responseObj: BaseResponse = fromSuccess(
        "Collection and associated movies deleted successfully",
        null
      );
      res.status(200).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed("Failed to delete collection");
      res.status(500).json(responseObj);

      // Log the error for debugging
      console.error("Error in deleteCollection:", error.message);
    }
  };

    /**
   * @Description  - Add a movie to a collection
   * @Route        - POST /api/collection/:id/movie
   * @Access       - Private
   * @RequestBody  - { movieDetails: { title: string, year: number, imdbID: string, type: string, poster: string } }
   * @Response     - Success response with added movie or failure message
   * 
   * This controller allows an authenticated user to add a movie to a collection by providing the movie's 
   * details (title, year, IMDb ID, type, and poster). It verifies the collection exists and belongs to the 
   * authenticated user before adding the movie. If successful, the movie is added to the collection, 
   * and a success response is returned. If the collection is not found or unauthorized, an error is returned.
   */
  export const addMovieToCollection = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { collectionId } = req.params;
      const { movieDetails }: IAddMovieToCollection = req.body;
      const user = req.user?.id; // Assuming user is authenticated

      // Validate if the collection exists and is owned by the authenticated user
      const collection = await CollectionSchema.findOne({
        _id: collectionId,
        createdBy: user,
      });
      if (!collection) {
        const responseObj: BaseResponse = fromFailed(
          "Collection not found or unauthorized access."
        );
        res.status(404).json(responseObj);
        return;
      }

      // Get movie details 
      const movieDetailsToSave = {
        title: movieDetails?.title,
        year: movieDetails?.year,
        imdbID: movieDetails?.imdbID,
        type: movieDetails?.type,
        poster: movieDetails?.poster,
      };

      // Create new movie entry in the user's collection
      const movieInCollection = await UserCollectionSchema.create({
        movie: movieDetailsToSave,
        addedBy: user,
        attachedCollection: collection,
        createdAt: new Date()
      });

      // Handle success response
      const responseObj: BaseResponse = fromSuccess(
        "Movie added to collection successfully",
        movieInCollection
      );
      res.status(201).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed(error.message);
      res.status(500).json(responseObj);
      console.error("Error in addMovieToCollection:", error);
    }
  };

    /**
   * @Description  - Get all movies in the collection
   * @Route        - GET /api/collection/:collectionId/movie
   * @Access       - Private
   * @QueryParams  - { page: string, take: string, search: string }
   * @Response     - Success response with movie list and pagination info or failure message
   * 
   * This controller retrieves all movies in a specific collection belonging to the authenticated user. 
   * It supports pagination and searching for movies by title. If no movies match the search criteria, 
   * a success response with an empty list is returned. If no movies exist in the collection, a message 
   * indicating "No movies found" is returned. If an error occurs during the process, an error message 
   * is sent back.
   */
  export const getCollectionMovieList = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      // Ensure the user is authenticated
      const userId = req?.user?.id;

      if (!userId) {
        const responseObj: BaseResponse = fromFailed("User is not authenticated");
        res.status(401).json(responseObj);
        return;
      }

      // Extract the collection ID from the request parameters
      const { collectionId } = req.params;

      if (!collectionId) {
        const responseObj: BaseResponse = fromFailed("Collection ID is required");
        res.status(400).json(responseObj);
        return;
      }

      // Get query parameters for pagination and search
      const { page = "1", take = "10", search = "" } = req.query;

      // Convert page and size to integers
      const currentPage = parseInt(page as string, 10);
      const pageSize = parseInt(take as string, 10);

      // Validate currentPage and pageSize values
      if (isNaN(currentPage) || isNaN(pageSize)) {
        const responseObj: BaseResponse = fromFailed(
          "Invalid page or size values"
        );
        res.status(400).json(responseObj);
        return;
      }

      // Build the search query for the movie title
      let searchFilter = {};
      if (search) {
        searchFilter = { "movie.title": { $regex: search, $options: "i" } };
      }

      // Find movies in the specified collection with pagination and search
      const movies = await UserCollectionSchema.find({
        attachedCollection: collectionId,
        addedBy: userId,
        ...searchFilter, // Apply the search filter
      })
        .skip((currentPage - 1) * pageSize) // Skip documents for pagination
        .limit(pageSize) // Limit to the page size
        .select("movie createdAt") // Select the movie and createdAt fields
        .sort({ createdAt: -1 }) // Sort by createdAt desc
        .lean();

      // Count the total number of movies in the collection matching the search filter
      const totalMovies = await UserCollectionSchema.countDocuments({
        attachedCollection: collectionId,
        addedBy: userId,
        ...searchFilter,
      });

      // If no movies are found, return a message
      if (!movies.length) {
        const responseObj: BaseResponse = fromSuccess("No movies found", []);
        res.status(200).json(responseObj);
        return;
      }

      // Send the success response with the movies and pagination info
      const responseObj: BaseResponse = fromSuccess(
        "Movies retrieved successfully",
        {
          items: movies,
          pageInfo: {
            totalCollections: totalMovies, // Total number of movies
            totalPages: Math.ceil(totalMovies / pageSize),
            currentPage,
            pageSize,
          },
        }
      );
      res.status(200).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed(
        "Failed to retrieve movies in the collection"
      );
      res.status(500).json(responseObj);

      console.error("Error in getCollectionMovieList:", error.message);
    }
  };


    /**
   * @Description  - Delete movie from collection
   * @Route        - DELETE /api/collection/:collectionId/movie/:movieId
   * @Access       - Private
   * @Response     - Success response confirming movie deletion or failure message
   * 
   * This controller handles the deletion of a movie from a specified collection. The user must be 
   * the owner of the collection to delete the movie. If the collection or movie is not found, 
   * or if the user does not have permission to delete the movie, an error response is returned.
   * Otherwise, a success message confirming the movie's removal is sent back.
   */
  export const deleteMovieToCollection = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { collectionId, movieId } = req.params; 
      const user = req.user?.id; 

      // Validate if the collection exists and if the user is the owner
      const collection = await CollectionSchema.findOne({
        _id: collectionId,
        createdBy: user,
      });
      if (!collection) {
        const responseObj: BaseResponse = fromFailed(
          "Collection not found or unauthorized access."
        );
        res.status(404).json(responseObj);
        return;
      }

      // Find the movie in the collection
      const movieInCollection = await UserCollectionSchema.findOneAndDelete({
        _id: movieId,
        addedBy: user,
      });

      if (!movieInCollection) {
        const responseObj: BaseResponse = fromFailed(
          "Movie not found in collection."
        );
        res.status(404).json(responseObj);
        return;
      }

      // Handle success response
      const responseObj: BaseResponse = fromSuccess(
        "Movie deleted from collection successfully",
        null
      );
      res.status(200).json(responseObj);
    } catch (error: any) {
      const responseObj: BaseResponse = fromFailed(error.message);
      res.status(500).json(responseObj);
      console.error("Error in deleteMovieToCollection:", error);
    }
  };
