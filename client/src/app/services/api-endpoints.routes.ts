// Base URL
const BASE_URL = process.env.REACT_APP_BACKEND_API;

// API Endpoints
export const ENDPOINT = {
  AUTH: {
    ROOT: `${BASE_URL}auth`,
    SIGN_UP: `${BASE_URL}auth/sign-up`,
    SIGN_IN: `${BASE_URL}auth/sign-in`
  },
  USER: {
    ROOT: `${BASE_URL}user`,
    ROOT_WITH_ID: (id: string) => `${BASE_URL}user/${id}`,
    ROOT_WITH_PAGINATOR: (
      currentPage: number,
      pageSize: number,
      searchQuery: string
    ) => {
      let url = `${BASE_URL}user?page=${currentPage}&take=${pageSize}`;
      if (searchQuery !== "") {
        url += `&search=${searchQuery}`;
      }
      return url;
    },
  },
  COLLECTION: {
    ROOT: `${BASE_URL}collection`,
    ROOT_WITH_ID: (id: string) => `${BASE_URL}collection/${id}`,
    ROOT_WITH_PAGINATOR: (
      currentPage: number,
      pageSize: number,
      searchQuery: string
    ) => {
      let url = `${BASE_URL}collection?page=${currentPage}&take=${pageSize}`;
      if (searchQuery !== "") {
        url += `&search=${searchQuery}`;
      }
      return url;
    },
  },
  MOVIE: {
    ROOT: `${BASE_URL}movie`,
    ROOT_WITH_ID: (id: string) => `${BASE_URL}movie/${id}`,
    ROOT_WITH_PAGINATOR: (
      currentPage: number,
      pageSize: number,
      searchQuery: string
    ) => {
      let url = `${BASE_URL}movie?page=${currentPage}&take=${pageSize}`;
      if (searchQuery !== "") {
        url += `&search=${searchQuery}`;
      }
      return url;
    },
  },
  USER_COLLECTION: {
    ADD_MOVIE_TO_COLLECTION: (collectionId: string) =>
      `${BASE_URL}collection/${collectionId}/movie`,
    DELETE_MOVIE_FROM_COLLECTION: (collectionId: string, movieId: string) =>
      `${BASE_URL}collection/${collectionId}/movie/${movieId}`,
    ROOT_WITH_PAGINATOR: (
      collectionId: string,
      currentPage: number,
      pageSize: number,
      searchQuery: string
    ) => {
      let url = `${BASE_URL}collection/${collectionId}/movie?page=${currentPage}&take=${pageSize}`;
      if (searchQuery !== "") {
        url += `&search=${searchQuery}`;
      }
      return url;
    },
  },
};
