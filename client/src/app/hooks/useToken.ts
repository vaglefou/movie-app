import { useEffect, useState } from "react";

interface UseTokenResult {
  token: string | null;
  setToken: (newToken: string) => void;
  clearToken: () => void;
}

const useToken = (): UseTokenResult => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to manually set the token
  const setNewToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("accessToken", newToken);
  };

  // Function to clear the token
  const clearToken = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  return { token, setToken: setNewToken, clearToken };
};

export default useToken;
