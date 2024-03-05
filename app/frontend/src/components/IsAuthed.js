import React from "react";import { Navigate } from "react-router-dom";

export default function IsAuthed({ children }) {
	const authed = false;
	
	return authed === true ? children : <Navigate to="/"/>;
}