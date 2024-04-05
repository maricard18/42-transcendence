import React, { useState, useContext, useEffect } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateProfileUserForm } from "../functions/validateForms";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { getToken } from "../functions/tokens";
import { checkEnterButton } from "../functions/fetchData";
import { AuthContext, UserInfoContext } from "./Context";
import "../../static/css/Buttons.css";
import "../../static/css/errors.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ChangeUsername() {
    const { setAuthed } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({ message: "" });
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });

    useEffect(() => {
        setFormData({
            ...formData,
            username: userInfo.username,
            email: userInfo.email,
        });
    }, [userInfo]);

    const handleValidation = async () => {
        let newErrors = validateProfileUserForm(formData, setFormData);
        setErrors(newErrors);
        setSuccess({});

        if (!newErrors.message) {
            const formDataToSend = new FormData();

            if (formData.username != userInfo.username) {
                formDataToSend.append("username", formData.username);
            }
            if (formData.email != userInfo.email) {
                formDataToSend.append("email", formData.email);
            }

            let size = 0;
            for (let pair of formDataToSend.entries()) {
                size++;
            }

            if (!size) {
                return;
            }

            const headers = {
                Authorization: `Bearer ${await getToken(setAuthed)}`,
            };

            const response = await fetchData(
                "/api/users/" + userInfo.id,
                "PUT",
                headers,
                formDataToSend
            );

            if (!response.ok) {
                newErrors = await handleResponse(
                    response,
                    formData,
                    setFormData
                );
                setErrors(newErrors);
                setSuccess({});
            } else {
                setUserInfo({
                    ...userInfo,
                    username: formData.username,
                    email: formData.email,
                });
                setSuccess({ message: "Changes saved" });
            }
        }
    };

    checkEnterButton(handleValidation);

    return (
        <div className="d-flex flex-column">
            <h6 className="sub-text mb-5">
                <b>Edit your username here</b>
            </h6>
            <form>
                <div className="position-relative">
                    {errors && <p className="form-error">{errors.message}</p>}
                    {success && (
                        <p className="form-success">{success.message}</p>
                    )}
                    <div className="mb-1">
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
                    <div className="mb-1">
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
                    <div>
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
