import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is already logged in when app starts
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Ask Django: "Who belongs to this token?"
                    const res = await api.get('/auth/users/me/');
                    setUser(res.data);
                } catch (error) {
                    console.error("Token invalid", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // 2. Login Function
    const login = async (username, password) => {
        // Get Token
        const res = await api.post('/auth/token/login/', { username, password });
        const token = res.data.auth_token;
        
        localStorage.setItem('token', token);
        
        // Get User Details immediately after
        const userRes = await api.get('/auth/users/me/');
        setUser(userRes.data);
    };

    // 3. Logout Function (Corrected)
    const logout = () => {
        // 1. Attempt to tell server to destroy token
        // We don't await this because we want to log out the user in the browser 
        // even if the server is down or the token is already invalid.
        api.post('/auth/token/logout/')
            .then(() => console.log("Logged out from server"))
            .catch(e => console.error("Server logout error", e));

        // 2. Remove token from browser immediately so UI updates
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;