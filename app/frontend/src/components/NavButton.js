import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../functions/tokens";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.css";

export default function NavButton({ template, page, children }) {
    const navigate = useNavigate();

    const { authed, setAuthed } = useContext(AuthContext);

    const handleClickTo = (path) => {
        if (page == "/") logout(setAuthed);
        navigate(path);
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
