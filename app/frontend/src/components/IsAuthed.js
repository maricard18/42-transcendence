import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context";

export default function IsAuthed({ children }) {
    const { authed, setAuthed } = useContext(AuthContext);

    return authed === true ? children : <Navigate to="/" />;
}
