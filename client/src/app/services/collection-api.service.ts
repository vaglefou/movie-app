import axios from "axios";
import { ENDPOINT } from "./api-endpoints.routes";

export const createCollection = async (token: any, formData: FormData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", 
    },
    timeout: 10000,
  };
  try {
    console.log("formData : ", formData);
    const response = await axios.post(
      `${ENDPOINT.COLLECTION.ROOT}`,
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

// Get all 
export const getAllCollections = async (
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
      `${ENDPOINT.COLLECTION.ROOT_WITH_PAGINATOR(
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

// Get by Id
export const getCollectionById = async (token: any, collectionId: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(
      `${ENDPOINT.COLLECTION.ROOT_WITH_ID(collectionId)}`,
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

// Delete 
export const deleteCollection = async (token: any, eventId: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.delete(
      `${ENDPOINT.COLLECTION.ROOT_WITH_ID(eventId)}`,
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
