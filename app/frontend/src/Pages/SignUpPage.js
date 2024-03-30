import React, { useState, useContext } from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateSignUpForm } from "../functions/validateForms";
import { useNavigate } from "react-router-dom";
import { checkEnterButton } from "../functions/fetchData";
import { FormDataContext } from "../components/Context";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
	const { formData, setFormData } = useContext(FormDataContext);
    
    const handleValidation = async () => {
        const newErrors = validateSignUpForm(formData, setFormData);
        setErrors(newErrors);

        if (!newErrors.message) {
           navigate("/create-profile");
        }
    };

    checkEnterButton(handleValidation);

	console.log("SignUp data: ", formData);

    return (
        <div className="container">
            <div className="center">
                <div className="d-flex flex-column justify-content-center">
					<h1 className="header mb-5">Sign Up</h1>
                    <form>
                        <div className="position-relative">
                            {errors && (
                                <p className="form-error">{errors.message}</p>
                            )}
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
