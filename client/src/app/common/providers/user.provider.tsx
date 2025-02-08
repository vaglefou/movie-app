import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getLoggedInUser } from "../../services/auth-api.service";
import useToken from "../../hooks/useToken";

// Define the structure of the User object
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Define the structure of the AuthContext properties
interface AuthContextProps {
  user: User | null; // The current authenticated user or null if not logged in
  updateUser: (userData: User) => void; // Function to update the user data
}

// Create a context for authentication with an initial value of null
export const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * AuthProvider component that wraps the application and provides authentication context.
 * It manages the user state and fetches user details when a token is available.
 *
 * @param children - The child components that will have access to the authentication context.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State to store the authenticated user
  const { token } = useToken(); // Custom hook to retrieve the authentication token

  /**
   * Fetches the details of the logged-in user using the provided token.
   * If successful, it updates the user state with the fetched data.
   *
   * @param token - The authentication token used to fetch user details.
   */
  const fetchUserDetails = async (token: string) => {
    try {
      const response = await getLoggedInUser(token); // API call to fetch user details
      if (response.success) {
        const userData: User = response?.data?.data; // Extract user data from the response
        setUser(userData); // Update the user state
      } else {
        console.log(response.error); // Log any errors returned by the API
      }
    } catch (error: any) {
      console.error("Error fetching user details:", error); // Log any unexpected errors
    }
  };

  // useEffect hook to fetch user details whenever the token changes
  useEffect(() => {
    if (token) {
      fetchUserDetails(token); // Fetch user details if a token is available
    }
  }, [token]);

  /**
   * Function to manually update the user state.
   *
   * @param userData - The new user data to set in the state.
   */
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Create the context value object containing the user and updateUser function
  const contextValue: AuthContextProps = {
    user,
    updateUser,
  };

  // Provide the context value to all child components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 *
 * @returns The authentication context containing the user and updateUser function.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext); // Retrieve the context value

  // Throw an error if the hook is used outside of an AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return the context value
};