import React, { useState, useContext } from "react";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateSignUpForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken } from "../functions/tokens";
import { AuthContext } from "../components/AuthContext";
import { checkEnterButton } from "../functions/fetchData";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ProfilePage() {
    const navigate = useNavigate();

    const { authed, setAuthed } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleValidation = async (event) => {
        let newErrors = validateSignUpForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            const response = await fetchData(
                "/api/users/",
                "POST",
                { "Content-type": "application/json" },
                input
            );

            if (response.ok) {
                createToken(formData, setAuthed);
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

	enterButton(handleValidation);

    return (
        <div className="center">
            <div className="row justify-content-start">
                <h1 className="header">Profile</h1>
                <h6 className="sub-text mb-5">Edit your profile here</h6>
                <form id="sign-up-form" action="/api/users" method="post">
                    <div className="position-relative">
                        {errors && (
                            <p className="form-error">{errors.message}</p>
                        )}
                        <div className="row justify-content-center mb-1">
                            <Input
                                type="text"
                                id="username"
                                template={errors.username ? "input-error" : ""}
                                value={formData.username}
                                setValue={(value) =>
                                    setFormData({
                                        ...formData,
                                        username: value,
                                    })
                                }
                            >
                                new username
                            </Input>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <Input
                                type="email"
                                id="email"
                                template={errors.email ? "input-error" : ""}
                                value={formData.email}
                                setValue={(value) =>
                                    setFormData({
                                        ...formData,
                                        email: value,
                                    })
                                }
                            >
                                new email
                            </Input>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <Input
                                type="password"
                                id="password"
                                template={errors.password ? "input-error" : ""}
                                value={formData.password}
                                setValue={(value) =>
                                    setFormData({
                                        ...formData,
                                        password: value,
                                    })
                                }
                            >
                                new password
                            </Input>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <Input
                                type="password"
                                id="confirm-password"
                                template={
                                    errors.confirmPassword ? "input-error" : ""
                                }
                                value={formData.confirmPassword}
                                setValue={(value) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: value,
                                    })
                                }
                            >
                                confirm new password
                            </Input>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <SubmitButton
                                template="secondary-button"
                                onClick={handleValidation}
                            >
                                Save Changes
                            </SubmitButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
