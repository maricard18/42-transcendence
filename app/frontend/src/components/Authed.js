import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context";

export function IsAuthed({ children }) {
    const { authed } = useContext(AuthContext);

	console.log("IsAuthed: " + authed);

    return authed === true ? children : <Navigate to="/" />;
}

export function IsNotAuthed({ children }) {
    const { authed } = useContext(AuthContext);

	console.log("IsNotAuthed: " + authed);

    return authed === true ? <Navigate to="/menu" /> : children;
}

