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
            const input = { username: user.value, password: password.value };
            sendData(input);
        }
    };

    const handleSignUpForm = () => {
        const form = document.getElementById("sign-up-form");
        const avatar = document.getElementById("avatar");
        const user = document.getElementById("user");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        if (password.value != confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords don't match");
        } else {
            confirmPassword.setCustomValidity("");
        }
        confirmPassword.reportValidity();

        if (password.value === confirmPassword.value && form.reportValidity()) {
            const input = {
                username: user.value,
                email: email.value,
                password: password.value,
            };
            sendData(input);
        }
    };

	const sendData = async (input) => {
		const response = await fetch("http://localhost:8000/api/users/", {
			method: "POST",
			headers: { "Content-type": "application/json" },
			mode: "cors",
			body: JSON.stringify(input),
		});

		const data = await response.json();
		console.log(data);
	};

    return (
        <button
            type="button"
            className={`btn btn-primary ${template}`}
            onClick={() => {
                form === "login" ? handleLoginForm() : handleSignUpForm();
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
