import React, { useState } from "react";
import Input from "../components/Input";
import FormButton from "../components/FormButton";
import { validateLoginForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { setToken, getToken } from "../functions/tokens";

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const handleValidation = async (event) => {
        let newErrors = validateLoginForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                grant_type: "password",
                username: formData.username,
                password: formData.password,
            };

            const response = await fetchData("/api/tokens/", "POST", input);

            if (response.ok) {
                setToken(response);
                navigate("/menu");
            } else {
                newErrors = await handleResponse(response, formData, setFormData);
                setErrors(newErrors);
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
