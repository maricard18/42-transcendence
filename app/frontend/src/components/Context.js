import React, { createContext, useState, useEffect } from "react";
import { hasToken } from "../functions/tokens";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState();

    useEffect(() => {
        setAuthed(hasToken);
    }, []);

    return (
        <AuthContext.Provider value={{ authed, setAuthed }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        id: "",
    });

    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};
