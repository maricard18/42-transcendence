import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import NavButton from "../components/NavButton";
import { DefaultAvatar } from "../components/Avatar";
import { UserInfoContext } from "../components/Context";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ProfilePage() {
	const { userInfo } = useContext(UserInfoContext);

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
                        {userInfo.avatar ? (
                            <img
                                src={userInfo.avatar}
                                alt="Avatar preview"
                                width="200"
                                height="200"
                                style={{ borderRadius: "50%" }}
                            />
                        ) : (
                            <DefaultAvatar width="200" height="200" />
                        )}
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
                            <NavButton template="primary-button" page="/">
                                Logout
                            </NavButton>
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
