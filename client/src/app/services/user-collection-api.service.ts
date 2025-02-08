import axios from "axios";
import { ENDPOINT } from "./api-endpoints.routes";

export const addMovieToCollection = async (
  token: any,
  formData: FormData,
  collectionId: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", 
    },
    timeout: 10000,
  };
  try {
    const response = await axios.post(
      `${ENDPOINT.USER_COLLECTION.ADD_MOVIE_TO_COLLECTION(collectionId)}`,
      formData,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Get all movies in collection 
export const getAllMoviesInCollections = async (
  token: any,
  currentPage: number,
  pageSize: number,
  searchQuery: string,
  collectionId: string,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(
      `${ENDPOINT.USER_COLLECTION.ROOT_WITH_PAGINATOR(
        collectionId,
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

// Delete collection by ID 
export const deleteMovieToCollection = async (
  token: any,
  collectionId: string,
  movieId: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.delete(
      `${ENDPOINT.USER_COLLECTION.DELETE_MOVIE_FROM_COLLECTION(
        collectionId,
        movieId
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
