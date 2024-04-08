import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavButton, { LogoutButton } from "../components/NavButton";
import { DefaultAvatar } from "../components/Avatar";
import { UserInfoContext, AuthContext } from "../components/Context";
import { getToken } from "../functions/tokens";
import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ProfilePage() {
    return (
        <div className="container">
            <div
                className="
				d-flex 
				flex-column 
				flex-md-row 
				align-items-center 
				justify-content-center 
				justify-content-md-evenly 
				vh-100"
            >
                <div className="d-flex flex-column">
                    <div className="mb-3">
                        <ChangeAvatar />
                    </div>
                    <div className="box mt-3">
                        <div
                            className="btn-group-vertical"
                            role="group"
                            aria-label="Vertical button group"
                        >
                            <NavButton
                                template="white-button"
                                page="/menu/profile/username"
                            >
                                Change Username
                            </NavButton>
                            <NavButton
                                template="white-button"
                                page="/menu/profile/password"
                            >
                                Change Password
                            </NavButton>
                            <LogoutButton template="primary-button">
                                Logout
                            </LogoutButton>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export function ChangeAvatar() {
    const { setAuthed } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
    const [newAvatar, setNewAvatar] = useState();

    function previewAvatar(event) {
        const file = event.target.files[0];
        if (file) {
            setNewAvatar(file);
        }
    }

    useEffect(() => {
        const checkNewAvatar = async () => {
            if (newAvatar) {
                const formDataToSend = new FormData();
                formDataToSend.append("avatar", newAvatar);

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
                    console.log(response.body);
                } else {
                    const userData = await getUserInfo(setAuthed);

                    if (userData) {
                        setUserInfo({
                            username: userData.username,
                            email: userData.email,
                            avatar: userData.avatar,
                            id: userData.id,
                        });
                    } else {
                        console.log("Error: failed to fetch user data.");
                    }
                }

                setNewAvatar();
            }
        };

        checkNewAvatar();
    }, [newAvatar]);

    return (
        <figure>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg, image/jpg"
                onChange={previewAvatar}
                hidden
            />
            <label htmlFor="avatar">
                {userInfo.avatar ? (
                    <img
                        src={userInfo.avatar}
                        alt="Avatar preview"
                        width="200"
                        height="200"
                        className="avatar-border-lg"
                        style={{ borderRadius: "50%" }}
                    />
                ) : (
                    <DefaultAvatar width="200" height="200" />
                )}
            </label>
        </figure>
    );
}
