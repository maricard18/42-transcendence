import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../functions/tokens";
import { AuthContext } from "./Context";
import "bootstrap/dist/css/bootstrap.css";

export default function NavButton({ template, page, children }) {
    const navigate = useNavigate();

    const handleClickTo = (page) => {
        if (
            (typeof page === "string" && page.startsWith("/")) ||
            typeof page === "number"
        ) {
            navigate(page);
        } else {
			console.log(page);
            window.open(page, "_self");
            return;
        }
    };

    return (
        <button
            type="button"
            className={`btn btn-primary ${template}`}
            onClick={() => {
                handleClickTo(page);
            }}
        >
            {children}
        </button>
    );
}

export function LogoutButton({ template, children }) {
    const navigate = useNavigate();
    const { setAuthed } = useContext(AuthContext);

    return (
        <button
            type="button"
            className={`btn btn-primary ${template}`}
            onClick={() => {
                logout(setAuthed);
                navigate("/");
            }}
        >
            {children}
        </button>
    );
}
