import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Buttons.css";
import { useNavigate } from "react-router-dom";

export default function FormSubmitButton({ template, form, children }) {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleLoginForm = () => {
		const form = document.getElementById("login-form");
		const usernameField = document.getElementById("username");
		const passwordField = document.getElementById("password");

		const input = {
			username: usernameField.value,
			password: passwordField.value,
		};

		setFormData({
			...formData,
			...input
		});

        if (form.reportValidity()) {
            sendData("/api/tokens/", input);
        }
    };

	const handleSignUpForm = () => {
		const form = document.getElementById("sign-up-form");
		// const avatar = document.getElementById("avatar");
		const usernameField = document.getElementById("username");
		const emailField = document.getElementById("email");
		const passwordField = document.getElementById("password");
		const confirmPasswordField = document.getElementById("confirm-password");
		
		const input = {
			username: usernameField.value,
			email: emailField.value,
			password: passwordField.value,
			confirmPassword: confirmPasswordField.value,
		};
		
		setFormData({
			...formData,
			...input
		});

        if (input.password !== input.confirmPassword) {
			confirmPasswordField.setCustomValidity("Passwords don't match");
			passwordField.value = "";
			confirmPasswordField.value = "";
			passwordField.reportValidity();
			confirmPasswordField.reportValidity();
		}

		if (input.password === input.confirmPassword && form.reportValidity()) {
			sendData("/api/users/", input);
		}
	};

	const sendData = async (endpoint, input) => {
		const response = await fetch("http://localhost:8000" + endpoint, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			mode: "cors",
			body: JSON.stringify(input),
		});

		if (response.ok) {
			navigate("/menu");
			return;
		}

		const data = await response.json();
		handleResponse(data);
	};

	const handleResponse = (data) => {
		const message = data["errors"]["message"];
		const usernameField = document.getElementById("username");
		const passwordField = document.getElementById("password");
		
		if (message === "Unauthorized") {
			passwordField.setCustomValidity("incorrect password");
			passwordField.value = "";
			passwordField.reportValidity();
		} else if (message === "Conflict") {
			usernameField.setCustomValidity("A user with that name already exists");
			usernameField.value = "";
			passwordField.value = "";
			usernameField.reportValidity();
			passwordField.reportValidity();
		} else {
			usernameField.setCustomValidity("This user doesn't exist");
			usernameField.value = "";
			passwordField.value = "";
			usernameField.reportValidity();
			passwordField.reportValidity();
		}
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
