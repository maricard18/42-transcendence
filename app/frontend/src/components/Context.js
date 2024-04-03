import React, { createContext, useState, useEffect } from "react";
import { getToken, hasToken } from "../functions/tokens";
import { useLocation } from "react-router-dom";
import { ws } from "../functions/websocket";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken(setAuthed);
            if (token) setAuthed(true);
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
    const location = useLocation().pathname;
    const [previousLocation, setPreviousLocation] = useState(location);
	var last_location;

    useEffect(() => {
        last_location = previousLocation;
    }, [previousLocation]);

    return (
        <PreviousLocationContext.Provider
            value={{ previousLocation, setPreviousLocation }}
        >
            {children}
        </PreviousLocationContext.Provider>
    );
};

export const OnQueueContext = createContext();
export const OnQueueProvider = ({ children }) => {
	const location = useLocation().pathname;
    const [onQueue, setOnQueue] = useState();

    useEffect(() => {
        console.log("Here");
		console.log(location)
        if (onQueue === false) {
            console.log("trying to close ws!");
            if (ws) {
				console.log("Closed ws");
                ws.close();
            }
        }
    }, [onQueue]);

    return (
        <OnQueueContext.Provider
            value={{ onQueue, setOnQueue }}
        >
            {children}
        </OnQueueContext.Provider>
    );
};

