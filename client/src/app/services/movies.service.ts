import axios from "axios";
import { ENDPOINT } from "./api-endpoints.routes";

// Get all movies
export const getAllMovies = async (
  token: any,
  currentPage: number,
  pageSize: number,
  searchQuery: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(
      `${ENDPOINT.MOVIE.ROOT_WITH_PAGINATOR(
        currentPage,
        pageSize,
        searchQuery
      )}`,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message,
    };
  }
};
