import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function FormSubmitButton({ template, onClick, children }) {
    return (
        <button
            type="button"
            className={`btn btn-primary ${template}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
