import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Inputs.css";

export function NormalInput({ type, id, children }) {
    return (
        <div className="mb-3">
            <input
                type={type}
                className="form-control primary-form"
                id={id}
                placeholder={children}
				required
            ></input>
        </div>
    );
}

export function PasswordInput({ id, children }) {
    return (
        <div className="mb-3">
            <input
                type="password"
                className="form-control primary-form"
                id={id}
                autoComplete="new-password"
                placeholder={children}
				required
            ></input>
        </div>
    );
}