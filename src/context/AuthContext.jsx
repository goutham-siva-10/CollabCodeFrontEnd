import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) setToken(stored);
    }, []);
    return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);