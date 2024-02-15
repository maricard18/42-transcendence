import React, { Children } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Form.css";

export function NormalForm({ typeName, children }) {
    return (
        <div className="mb-3">
                <input
                    type={typeName}
                    className="form-control primary-form"
                    id="exampleFormControlInput1"
                    placeholder={children}
                ></input>
        </div>
    );
}

export function PasswordForm({ children }) {
    return (
        <div className="mb-3">
                <input
                    type="password"
                    className="form-control primary-form"
                    id="inputPassword2"
                    autocomplete="new-password"
                    placeholder={children}
                ></input>
        </div>
    );
}
