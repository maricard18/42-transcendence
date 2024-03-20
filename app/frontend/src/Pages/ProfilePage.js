import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import NavButton from "../components/NavButton";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function ProfilePage({ children }) {
    const navigate = useNavigate();

    const { authed, setAuthed } = useContext(AuthContext);

    return (
        <div className="center">
            <div className="row justify-content-center">
                <div className="col justify-content-center me-5">
                    <div className="row">
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
                <div className="col justify-content-center ms-5">
                    <div className="row">{children}</div>
                </div>
            </div>
        </div>
    );
}
