import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState({
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  });

  const login = (loginResponse) => {

    const {
      accessToken,
      refreshToken,
      email,
      role
    } = loginResponse;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    setUser({
      email,
      role,
    });
  };

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}