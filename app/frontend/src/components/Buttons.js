import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../static/css/Buttons.css";
import { useNavigate } from "react-router-dom";

export function FormButton({ template, form, children }) {
    const handleLoginData = () => {
        const user = document.getElementById("user");
        const password = document.getElementById("password");
        const data = { username: user.value, password: password.value };
        console.log(data);
        sendData(data);
    };

    const handleSignUpData = () => {
        const user = document.getElementById("user");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const data = {
            username: user.value,
            email: email.value,
            password: password.value,
        };
        console.log(data);
        sendData(data);
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
                form === "login" ? handleLoginData() : handleSignUpData();
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
