import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Buttons.css";
import { useNavigate } from "react-router-dom";

export function FormSubmitButton({ template, form, children }) {
    const handleLoginForm = () => {
        const form = document.getElementById("login-form");
        const user = document.getElementById("user");
        const password = document.getElementById("password");

        if (form.reportValidity()) {
            const data = { username: user.value, password: password.value };
            console.log(data);
            sendData(data);
        }
    };

    const handleSignUpForm = () => {
        const form = document.getElementById("sign-up-form");
        const user = document.getElementById("user");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        if (password.value != confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords don't match");
            console.log("passwords don't match");
        } else {
            confirmPassword.setCustomValidity("");
            console.log("passwords match");
        }
		confirmPassword.reportValidity();

        if (password.value == confirmPassword.value && form.reportValidity()) {
            const data = {
                username: user.value,
                email: email.value,
                password: password.value,
            };
            console.log(data);
            sendData(data);
        }
    };

    const sendData = (jsonData) => {
        fetch("http://localhost:8000/api/users", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            mode: "cors",
            body: JSON.stringify(jsonData),
        });
    };

    return (
        <button
            type="button"
            className={`btn btn-primary ${template}`}
            onClick={() => {
                form == "login" ? handleLoginForm() : handleSignUpForm();
            }}
        >
            {children}
        </button>
    );
}

export function NavButton({ template, page, children }) {
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
