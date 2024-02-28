import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function NavButton({ template, page, children }) {
    const navigate = useNavigate();

    const handleClickTo = (path) => {
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
