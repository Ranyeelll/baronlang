import React, { useState, createContext, useContext } from "react";
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
interface User {
  name: string;
  email: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation
    if (email === "demo@example.com" && password === "password") {
      setUser({
        name: "Baron",
        email
      });
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid email or password");
    }
  };
  const signup = async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation
    if (email === "demo@example.com") {
      throw new Error("Email already registered");
    }
    setUser({
      name,
      email
    });
    setIsAuthenticated(true);
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    signup,
    logout
  }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};