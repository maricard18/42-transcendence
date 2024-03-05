import React, { useContext } from "react";import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";


export default function IsAuthed({ children }) {
	const { authed, setAuthed } = useContext(AuthContext);

	return authed === true ? children : <Navigate to="/"/>;
}