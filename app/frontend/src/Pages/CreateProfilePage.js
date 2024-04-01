import React, { useState, useContext, useEffect } from "react";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken } from "../functions/tokens";
import { AuthContext, FormDataContext } from "../components/Context";
import { checkEnterButton } from "../functions/fetchData";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function CreateProfilePage() {
    const navigate = useNavigate();
    const { setAuthed } = useContext(AuthContext);
    const { formData, setFormData } = useContext(FormDataContext);
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState();

    useEffect(() => {
        if (Object.values(formData).every((value) => value === "")) {
            navigate("/sign-up");
        }
    }, [formData]);

    const handleValidation = async () => {
        let newErrors = {};

        if (formData.username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        } else if (
            formData.username.length < 4 ||
            formData.username.length > 12
        ) {
            newErrors.message = "Username must be 4 to 12 characters";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        }

        if (!newErrors.message) {
			const formDataToSend = new FormData();
			formDataToSend.append('username', formData.username);
			formDataToSend.append('email', formData.email);
			formDataToSend.append('password', formData.password);
		
			if (file) {
				formDataToSend.append('avatar', file, "mouse.jpg");
			}
		
			const response = await fetchData(
				"/api/users",
				"POST",
				null,
				formDataToSend
			);

            if (response.ok) {
                await createToken(formData, setAuthed);
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
                    <form>
                        <div className="mb-5">
                            <Avatar setFile={setFile} />
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
