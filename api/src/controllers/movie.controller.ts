import { Request, Response } from "express";
import { BaseResponse, fromFailed, fromSuccess,} from "../common/utils/base-response.utils";
import axios from "axios";
import configurations from "../configurations/configurations";

//Getting the  configurations
const CONFIG = configurations();

// Get all movies with proper pagination and search handling
export const getAllMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract query parameters
    const { search = "", page = "1", pageSize = "10" } = req.query;

    // Validate and parse pagination parameters
    const currentPage = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    if (isNaN(currentPage) || currentPage <= 0) {
      const responseObj: BaseResponse = fromFailed(
        "Invalid page number. It must be a positive integer."
      );
      res.status(500).json(responseObj);
      return;
    }

    if (isNaN(pageSizeNum) || pageSizeNum <= 0) {
      const responseObj: BaseResponse = fromFailed(
        "Invalid page size. It must be a positive integer."
      );
      res.status(500).json(responseObj);
      return;
    }

    const searchQuery = typeof search === "string" ? search.trim() : "";
    const encodedSearch = searchQuery
      ? encodeURIComponent(searchQuery)
      //OMDb API search query
      : "Stanley Kubrick";

    // Construct OMDb API URL
    const omdbUrl = `https://www.omdbapi.com/?apikey=${CONFIG.OMDB.apiKey}&s=${encodedSearch}&page=${currentPage}`;

    // Fetch movies from OMDb API
    const response = await axios.get(omdbUrl);

    // Handle errors from OMDb API
    if (response.data.Response === "False") {
      const responseObj: BaseResponse = fromFailed("Movies not found.");
      res.status(500).json(responseObj);
      return;
    }

    const movies = response.data.Search || [];
    const totalResults = parseInt(response.data.totalResults, 10) || 0;

    // Calculate total pages based on the provided page size
    const totalPages = Math.ceil(totalResults / pageSizeNum);

    // Return success response with movies and pagination info
    res.status(200).json(
      fromSuccess(
        search
          ? `Search results for '${search}' retrieved successfully`
          : "Default movies retrieved successfully",
        {
          items: movies,
          pageInfo: {
            currentPage,
            pageSize: pageSizeNum,
            totalCollections: totalResults,
            totalPages,
          },
        }
      )
    );
  } catch (error: any) {
    console.error("Error retrieving movies:", error.message);
    res
      .status(500)
      .json(fromFailed(error.message || "Failed to retrieve movies."));
  }
};
