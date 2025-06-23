// PERBAIKAN: Impor useCallback
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // PERBAIKAN: Bungkus fungsi 'login' dengan useCallback
  // Ini memastikan fungsi ini tidak dibuat ulang di setiap render,
  // sehingga tidak memicu useEffect secara berulang.
  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  }, []); // Array dependensi kosong berarti fungsi ini hanya dibuat sekali

  // PERBAIKAN: Bungkus fungsi 'logout' dengan useCallback
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []); // Array dependensi kosong

  const contextValue = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
