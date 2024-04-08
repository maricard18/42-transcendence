import React, { useEffect, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import NavButton, { LogoutButton } from "../components/NavButton";
import getUserInfo from "../functions/getUserInfo";
import {
    AuthContext,
    LoadingContext,
    UserInfoContext,
} from "../components/Context";
import { BaseAvatar } from "../components/Avatar";
import { LoadingIcon } from "../components/Icons";
import "../../static/css/NavBar.css";
import "../../static/css/Buttons.css";
import "../../static/css/Menu.css";
import "../../static/css/HomePage.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

export default function NavigationBar() {
    const { setAuthed } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
    const { loading, setLoading } = useContext(LoadingContext);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userData = await getUserInfo(setAuthed);

            if (userData) {
                setUserInfo({
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    id: userData.id,
                });
                setLoading(false);
            } else {
                console.log("Error: failed to fetch user data.");
            }
        };

        setLoading(true);
        fetchUserInfo();
    }, []);

    return loading ? (
        <div className="container-fluid">
            <LoadingIcon size="5rem" />
        </div>
    ) : (
        <div className="container-fluid">
            <nav className="navbar navbar-dark navbar-layout fixed-top">
                <p>
                    <Link
                        className="navbar-brand navbar-text-layout ms-5"
                        to=""
                    >
                        Transcendence
                    </Link>
                </p>
                <div className="btn-group me-5">
                    <button
                        type="button"
                        //className="btn btn-secondary dropdown-toggle navbar-icon"
                        className="btn btn-secondary navbar-icon"
                        data-bs-toggle="dropdown"
                        data-bs-display="static"
                        aria-expanded="false"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end menu-box">
                        <div
                            className="btn-group-vertical d-flex flex-column"
                            role="group"
                            aria-label="Vertical button group"
                        >
                            <div className="d-flex align-items-center mb-3">
                                {userInfo.avatar ? (
                                    <img
                                        src={userInfo.avatar}
                                        alt="Avatar preview"
                                        width="40"
                                        height="40"
                                        className="avatar-border-sm"
                                        style={{ borderRadius: "50%" }}
                                    />
                                ) : (
                                    <BaseAvatar
                                        width="40"
                                        height="40"
                                        template=""
                                    />
                                )}
                                <h6 className="username-text ms-2 mt-1">
                                    <b>{userInfo.username}</b>
                                </h6>
                            </div>
                            <NavButton template="white-button" page="/menu">
                                Home
                            </NavButton>
                            <NavButton
                                template="white-button"
                                page="/menu/profile/username"
                            >
                                Profile
                            </NavButton>
                            <LogoutButton template="white-button">
                                Logout
                            </LogoutButton>
                        </div>
                    </div>
                </div>
            </nav>
            <div>
                <Outlet />
            </div>
        </div>
    );
}
