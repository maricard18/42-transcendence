import React, { createContext, useState, useEffect } from "react";
import { getToken, hasToken } from "../functions/tokens";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken(setAuthed);
			if (token)
            	setAuthed(true);
			setLoading(false);
        };
        checkToken();
    }, []);

	if (loading) {
		return null;
	}

    return (
        <AuthContext.Provider value={{ authed, setAuthed }}>
            {children}
        </AuthContext.Provider>
    );
};

export const FormDataContext = createContext();
export const FormDataProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    return (
        <FormDataContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};

export const UserInfoContext = createContext();
export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
		avatar: "",
        id: "",
    });

    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const UserQueueContext = createContext();
export const UserQueueProvider = ({ children }) => {
    const [userQueue, setUserQueue] = useState({});

    return (
        <UserQueueContext.Provider value={{ userQueue, setUserQueue }}>
            {children}
        </UserQueueContext.Provider>
    );
};

export const PreviousLocationContext = createContext();
export const PreviousLocationProvider = ({ children }) => {
    const location = useLocation();
    const [previousLocation, setPreviousLocation] = useState(location.pathname);

    return (
        <PreviousLocationContext.Provider
            value={{ previousLocation, setPreviousLocation }}
        >
            {children}
        </PreviousLocationContext.Provider>
    );
};
