import React from "react";
import { Outlet } from "react-router-dom";
import NavButton from "../components/NavButton";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ProfilePage({ children }) {


    return (
        <div className="center">
            <div className="d-flex justify-content-center">
                <div className="col justify-content-center me-5">
                    <div className="d-flex flex-column">
                        <h1 className="header">Profile</h1>
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
                                <NavButton template="white-button">
                                    Change Avatar
                                </NavButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="col justify-content-center ms-5">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
