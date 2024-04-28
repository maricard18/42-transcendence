import React, { useState, useContext, useEffect } from "react";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { createToken, getToken } from "../functions/tokens";
import { LoadingIcon } from "../components/Icons";
import { checkEnterButton } from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import {
    AuthContext,
    FormDataContext,
    UserInfoContext,
} from "../components/Context";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";
import { transitEncrypt } from "../functions/vaultAccess";

export function CreateProfilePage() {
    const navigate = useNavigate();
    const { setAuthed } = useContext(AuthContext);
    const { formData, setFormData } = useContext(FormDataContext);
    const { setUserInfo } = useContext(UserInfoContext);
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState();
    
    useEffect(() => {
        if (Object.values(formData).every((value) => value === "")) {
            navigate("/sign-up");
        }
    }, [formData]);

    const handleValidation = async () => {
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
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
            newErrors.message = "Username must have 4-12 characters";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        } else if (!usernamePattern.test(formData.username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        }
        
        if (!newErrors.message) {
            const formDataToSend = new FormData();

            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", await transitEncrypt(formData.password));
            
            if (file) {
                formDataToSend.append("avatar", file);
            }

            const response = await fetchData(
                "/api/users",
                "POST",
                null,
                formDataToSend
            );

            if (response.ok) {
                await createToken(formData, setAuthed);
                setUserInfo({
                    username: formData.username,
                    email: formData.email,
                    avatar: file ? URL.createObjectURL(file) : null,
                    id: null,
                });
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

export function Create42ProfilePage() {
    const navigate = useNavigate();
    const { setAuthed } = useContext(AuthContext);
    const { setUserInfo } = useContext(UserInfoContext);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ username: "" });
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState();
    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const data = await getUserInfo(setAuthed);

            if (data) {
                setUserData(data);
                setLoading(false);
            } else {
                console.error("Error: failed to fetch user data.");
                setLoading(false);
                navigate("/");
            }
        };

        setLoading(true);
        fetchUserInfo();
    }, []);

    const handleValidation = async () => {
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
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
            newErrors.message = "Username must have 4-12 characters";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        } else if (!usernamePattern.test(formData.username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            setFormData({ ...formData, username: "" });
            setErrors(newErrors);
        }

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);

            if (file) {
                formDataToSend.append("avatar", file);
            }

            const accessToken = await getToken(setAuthed);
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + userData.id,
                "PUT",
                headers,
                formDataToSend
            );

            if (response.ok) {
                setUserInfo({
                    username: formData.username,
                    email: userData.email,
                    avatar: file ? file : userData.avatar,
                    id: userData.id,
                });
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
            {loading ? (
                <LoadingIcon size="5rem" />
            ) : (
                <div className="center">
                    <div className="d-flex flex-column justify-content-center">
                        <form>
                            <div className="mb-5">
                                <Avatar
                                    setFile={setFile}
                                    url={userData ? userData.avatar : null}
                                />
                            </div>
                            <div className="position-relative">
                                {errors && (
                                    <p className="form-error">
                                        {errors.message}
                                    </p>
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
            )}
        </div>
    );
}
