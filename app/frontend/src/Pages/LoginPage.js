import React, { useState } from "react";
import Input from "../components/Input";
import FormButton from "../components/FormButton";
import { validateLoginForm } from "../functions/validateForm";
import { useNavigate } from "react-router-dom";
import sendRequest from "../functions/sendRequest";

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const handleValidation = async (event) => {
        const newErrors = validateLoginForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                username: formData.username,
                password: formData.password,
            };

            const result = await sendRequest(
                "/api/tokens/",
                input,
                setErrors,
                formData,
                setFormData
            );
            if (result) {
                navigate("/menu");
            }
        }
    };

    return (
        <section className="center">
            <div className="container">
                <h1 className="header mb-5">Welcome back</h1>
                <form id="login-form" action="/api/users" method="post">
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
                                username or email
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
                                password
                            </Input>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <FormButton
                                template="secondary-button"
                                form="login"
                                data={formData}
                                setData={formData}
                                onClick={handleValidation}
                            >
                                Next
                            </FormButton>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
