import React, { useState, useContext } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateProfilePasswordForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken } from "../functions/tokens";
import { AuthContext } from "../components/AuthContext";
import { checkEnterButton } from "../functions/fetchData";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ChangePassword() {
    const navigate = useNavigate();

    const { authed, setAuthed } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleValidation = async () => {
        let newErrors = validateProfilePasswordForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                password: formData.password,
            };

            const response = await fetchData(
                '/api/users/',
                'PUT',
                { 'Content-type': 'application/json' },
				{ 'Authorization': 'Bearer ' + await getToken() },
                input
            );

            if (!response.ok) {
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
        <div className="d-flex flex-column">
            <h6 className="sub-text mb-5">
                <b>Edit your password here</b>
            </h6>
            <form id="sign-up-form" action="/api/users/" method="post">
                <div className="position-relative">
                    {errors && <p className="form-error">{errors.message}</p>}
                    <div className="d-flex justify-content-center mb-1">
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
                    <div className="d-flex justify-content-center mb-1">
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
                            Save changes
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
}
