import React, { useState, useContext } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateProfileUserForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken, getToken } from "../functions/tokens";
import { AuthContext } from "../components/AuthContext";
import { checkEnterButton } from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ChangeUsername() {
    const navigate = useNavigate();

    const { authed, setAuthed } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: '', //TODO username: getUserInfo()
        email: '', //TODO email: getUserInfo()
    });

    const [errors, setErrors] = useState({});

    const handleValidation = async () => {
        let newErrors = validateProfileUserForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
            const input = {
                username: formData.username,
                email: formData.email,
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
                <b>Edit your username here</b>
            </h6>
            <form id="sign-up-form" action="/api/users/" method="post">
                <div className="position-relative">
                    {errors && <p className="form-error">{errors.message}</p>}
                    <div className="d-flex justify-content-center mb-1">
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
                            username
                        </Input>
                    </div>
                    <div className="d-flex justify-content-center mb-1">
                        <Input
                            type="email"
                            id="email"
                            template={errors.email ? "input-error" : ""}
                            value={formData.email}
                            setValue={(value) =>
                                setFormData({ ...formData, email: value })
                            }
                        >
                            email
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
