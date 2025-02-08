import axios from "axios";
import { ENDPOINT } from "./api-endpoints.routes";

// Login user API call
export const signInUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH.SIGN_IN}`, {
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Register new user API call
export const signUpUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH.SIGN_UP}`, {
      username,
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};




// Get logged in user API call
export const getLoggedInUser = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(`${ENDPOINT.AUTH.ROOT}`, config);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
