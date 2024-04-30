import React, { useState, useContext } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateProfilePasswordForm } from "../functions/validateForms";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { checkEnterButton } from "../functions/fetchData";
import { getToken, decode } from "../functions/tokens";
import { AuthContext, UserInfoContext } from "./Context";
import "../../static/css/Buttons.css";
import "../../static/css/errors.css";
import "bootstrap/dist/css/bootstrap.css";
import { transitEncrypt } from "../functions/vaultAccess";

export default function ChangePassword() {
    const { setAuthed } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({ message: "" });
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleValidation = async () => {
        let newErrors = validateProfilePasswordForm(formData, setFormData);
        setErrors(newErrors);
        setSuccess({});

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("password", await transitEncrypt(formData.password));

            const accessToken = await getToken(setAuthed);
            const decodedToken = decode(accessToken);
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + decodedToken["user_id"],
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
                    id: decodedToken["user_id"],
                });
                setSuccess({ message: "Changes saved" });
            }
        }
    };

    checkEnterButton(handleValidation);

    return (
        <div className="d-flex flex-column">
            <h6 className="sub-text mb-5">
                <b>Edit your password here</b>
            </h6>
            <form>
                <div className="position-relative">
                    {errors && <p className="form-error">{errors.message}</p>}
                    {success && (
                        <p className="form-success">{success.message}</p>
                    )}
                    <div className="mb-1">
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
                    <div className="mb-1">
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
