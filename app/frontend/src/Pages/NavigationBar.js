import React, { useEffect, useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import NavButton from "../components/NavButton";
import getUserInfo from "../functions/getUserInfo";
import { AuthContext, UserInfoContext } from "../components/Context";
import "../../static/css/NavBar.css";
import "../../static/css/Buttons.css";
import "../../static/css/Menu.css";
import "../../static/css/HomePage.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

export default function NavigationBar() {
    const { setAuthed } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
	const location = useLocation();
	let template = "dropdown";

	if (location.pathname == "/menu/profile/username" ||
		location.pathname == "/menu/profile/username/")
		template = "dropdown"

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userData = await getUserInfo(setAuthed);

            setUserInfo({
                username: userData.username,
                email: userData.email,
                id: userData.id,
            });
        };

        fetchUserInfo();
    }, [userInfo.username]);

    return (
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
                        data-bs-toggle={template}
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
                            <h6 className="sub-header text-center">
                                <b>{userInfo.username}</b>
                            </h6>
                            <NavButton template="white-button" page="/menu">
                                Home
                            </NavButton>
                            <NavButton
                                template="white-button"
                                page="profile/username"
                            >
                                Profile
                            </NavButton>
                            <NavButton template="white-button" page="/">
                                Logout
                            </NavButton>
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
