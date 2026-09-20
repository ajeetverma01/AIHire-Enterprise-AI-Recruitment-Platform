import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const accessToken = localStorage.getItem("accessToken");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (!accessToken || !email || !role) {
            return null;
        }

        return {
            email,
            role,
        };
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

    useEffect(() => {

        const handleAuthExpired = () => {
            logout();
        };

        window.addEventListener(
            "auth-expired",
            handleAuthExpired
        );

        return () => {
            window.removeEventListener(
                "auth-expired",
                handleAuthExpired
            );
        };

    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}