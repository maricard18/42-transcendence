import React, { useState, useContext } from "react";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateSignUpForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken } from "../functions/tokens";
import { AuthContext } from "../components/Context";
import { checkEnterButton } from "../functions/fetchData";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function SignUpPage() {
    const navigate = useNavigate();

    const { setAuthed } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleValidation = async () => {
        let newErrors = validateSignUpForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            const response = await fetchData(
                "/api/users",
                "POST",
                { "Content-type": "application/json" },
                input
            );

            if (response.ok) {
                const success = await createToken(formData, setAuthed);
                if (success) {
                    navigate("/menu");
                }
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

	//! remove username field on this page
	//! create another sign up page after this one with username field and avatar
	//! send all the info at once after user finishes to create their profile

    return (
        <div className="container">
            <div className="center">
                <div className="d-flex flex-column justify-content-center">
                    <form>
                        <div className="mb-5">
                            <Avatar />
                        </div>
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
                                    username
                                </Input>
                            </div>
                            <div className="mb-1">
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
                                    email
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
                            <div className="mb-1">
                                <Input
                                    type="password"
                                    id="confirm-password"
                                    template={
                                        errors.confirmPassword
                                            ? "input-error"
                                            : ""
                                    }
                                    value={formData.confirmPassword}
                                    setValue={(value) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: value,
                                        })
                                    }
                                >
                                    confirm password
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
