import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../functions/tokens";
import { AuthContext } from "./Context";
import "bootstrap/dist/css/bootstrap.css";

export default function NavButton({ template, page, children }) {
    const navigate = useNavigate();

    const { setAuthed } = useContext(AuthContext);

    const handleClickTo = (path) => {
        if (page == "/") {
            logout(setAuthed);
        } else if (page.includes("https://api.intra.42.fr/oauth/authorize")) {
            window.open(page, "_self");
            return;
        }
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
