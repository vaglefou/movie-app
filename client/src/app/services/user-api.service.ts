import axios from "axios";
import { ENDPOINT } from "./api-endpoints.routes";

// Get all users 
export const getAllUsers = async (
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
      `${ENDPOINT.USER.ROOT_WITH_PAGINATOR(
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


// Delete user API call
export const deleteUser = async (token: any, id: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.delete(
      `${ENDPOINT.USER.ROOT_WITH_ID(id)}`,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
