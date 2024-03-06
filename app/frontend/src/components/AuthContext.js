import React, { createContext, useState } from "react";
import { hasToken } from "../functions/tokens";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const value = hasToken();
	
	const [authed, setAuthed] = useState(value);

    return (
        <AuthContext.Provider value={{ authed, setAuthed }}>
            {children}
        </AuthContext.Provider>
    );
};
