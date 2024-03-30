import React, { useState, useContext } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateLoginForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { setToken } from "../functions/tokens";
import { AuthContext } from "../components/Context";
import { checkEnterButton } from "../functions/fetchData";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function LoginPage() {
    const navigate = useNavigate();

    const { setAuthed } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleValidation = async () => {
        let newErrors = validateLoginForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                grant_type: "password",
                username: formData.username,
                password: formData.password,
            };

            const response = await fetchData(
                "/api/tokens",
                "POST",
                { "Content-type": "application/json" },
                input
            );

            if (response.ok) {
                await setToken(response, setAuthed);
                navigate("/menu");
            } else {
                newErrors = await handleResponse(
                    response,
                    formData,
                    setFormData
                );
                setErrors(newErrors);
            }
        }
    };

    checkEnterButton(handleValidation);

    return (
        <div className="container">
            <div className="center">
                <div className="d-flex flex-column justify-content-center">
                    <h1 className="header mb-5">Welcome back</h1>
                    <form>
                        <div className="position-relative">
                            {errors && (
                                <p className="form-error">{errors.message}</p>
                            )}
                            <div className="mb-1">
                                <Input
                                    type="text"
                                    id="username"
                                    template={
                                        errors.username ? "input-error" : ""
                                    }
                                    value={formData.username}
                                    setValue={(value) =>
                                        setFormData({
                                            ...formData,
                                            username: value,
                                        })
                                    }
                                >
                                    username or email
                                </Input>
                            </div>
                            <div className="mb-1">
                                <Input
                                    type="password"
                                    id="password"
                                    template={
                                        errors.password ? "input-error" : ""
                                    }
                                    value={formData.password}
                                    setValue={(value) =>
                                        setFormData({
                                            ...formData,
                                            password: value,
                                        })
                                    }
                                >
                                    password
                                </Input>
                            </div>
                            <div>
                                <SubmitButton
                                    template="secondary-button"
                                    onClick={handleValidation}
                                >
                                    Next
                                </SubmitButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
