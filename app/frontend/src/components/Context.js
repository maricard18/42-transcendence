import React, { createContext, useState, useEffect } from "react";
import { getToken } from "../functions/tokens";
import { useLocation } from "react-router-dom";
import { MyWebSocket } from "../functions/websocket";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken(setAuthed);
            if (token) {
				setAuthed(true);
			}
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

export const UserDataContext = createContext();
export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState([]);

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const LoadingContext = createContext();
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState();

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const PreviousLocationContext = createContext();
export const PreviousLocationProvider = ({ children }) => {
    const location = useLocation().pathname;
    const [previousLocation, setPreviousLocation] = useState(location);

    useEffect(() => {
        if ((previousLocation === "/menu/pong-game/multiplayer/waiting-room/2" ||
            previousLocation === "/menu/pong-game/multiplayer/waiting-room/4") &&
            location !== "/menu/pong-game/play/multiplayer/2" &&
            location !== "/menu/pong-game/play/multiplayer/4") {
            if (MyWebSocket.ws) {
                MyWebSocket.ws.close();
                delete MyWebSocket.ws;
            }
        }
    });

    return (
        <PreviousLocationContext.Provider
            value={{ previousLocation, setPreviousLocation }}
        >
            {children}
        </PreviousLocationContext.Provider>
    );
};
