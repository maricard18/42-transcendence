import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Buttons.css";
import { useNavigate } from "react-router-dom";

export default function Button({ template, page, children }) {
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
