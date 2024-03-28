import React, { useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./Context";
import { refreshToken } from "../functions/tokens";

export function IsAuthed({ children }) {
    const { authed, setAuthed } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    var access_token = "";

    useEffect(() => {
        const refreshAccessToken = async () => {
            access_token = await refreshToken(setAuthed);
            if (!access_token) {
                navigate("/");
            }
        };

        if (!authed) {
            refreshAccessToken();
        }
    }, [authed]);

    function renderComponent() {
        if (!authed && !access_token) {
            return <Navigate to={location.pathname} />;
        } else if (authed) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    }

    return renderComponent();
}

export function IsNotAuthed({ children }) {
    const { authed } = useContext(AuthContext);

    return authed === true ? <Navigate to="/menu" /> : children;
}
