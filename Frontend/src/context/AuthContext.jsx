import { createContext, useContext, useEffect, useState } from "react";
import api from "../Services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check currently logged-in user
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      // 401 simply means the user is not logged in
      if (error.response?.status !== 401) {
        console.error("AUTH CHECK ERROR:", error);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(response.data.data.user);

    return response.data;
  };

  // REGISTER
  const register = async (username, email, password, fullName) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      fullName,
    });

    return response.data;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
