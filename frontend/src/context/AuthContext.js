import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setUser(data);
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (e) {
            console.error("Errore fetch user", e);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    const login = async (token) => {
        localStorage.setItem("token", token);
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};