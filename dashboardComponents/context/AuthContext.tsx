import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("adminName");

    if (token && name) {
      setIsAuthenticated(true);
      setAdminName(name);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // En production, utiliser une vraie API
    if (email === "admin@monshop.com" && password === "password") {
      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("adminName", "John Doe");
      setIsAuthenticated(true);
      setAdminName("John Doe");
    } else {
      throw new Error("Identifiants invalides");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    setIsAuthenticated(false);
    setAdminName("");
  };

  if (isLoading) {
    return <div>Chargement de l'authentification...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
