import React, {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(token) {
            const parsedUser = parseJwt(token);
            const now = Date.now() / 1000;
            if(parsedUser?.exp && parsedUser.exp < now){
                logout();
            } else {
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, [token]);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{token, user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);

function parseJwt(token) {
    try{
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}
