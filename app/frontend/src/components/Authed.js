import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./Context";
import { getToken } from "../functions/tokens";

export function IsAuthed({ children }) {
    const { authed, setAuthed } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAccessToken = async () => {
            await getToken(setAuthed);
            setLoading(false);
        };

        if (!authed) {
            checkAccessToken();
        } else {
            setLoading(false);
        }
    }, [authed]);

    function renderComponent() {
        if (loading) {
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
    const location = useLocation().pathname;

	//! check if this condition is needded
    return authed === true &&
        (location != "/login/42" && location != "/create-profile/42") ? (
        <Navigate to="/menu" />
    ) : (
        children
    );
}
