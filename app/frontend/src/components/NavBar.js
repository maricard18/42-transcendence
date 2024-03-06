import React from "react";
import { Outlet } from "react-router-dom";
import NavButton from "./NavButton";
import "../../static/css/NavBar.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-dark navbar-layout fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand navbar-text-layout ms-5">
                        Transcendence
                    </a>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-secondary dropdown-toggle navbar-icon"
                            data-bs-toggle="dropdown"
                            data-bs-display="static"
                            aria-expanded="false"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <NavButton
                                    template="dropdown-item menu-text"
                                    page="/menu"
                                    option="true"
                                >
                                    Home
                                </NavButton>
                            </li>
                            <li>
                                <NavButton template="dropdown-item menu-text">
                                    Profile
                                </NavButton>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <NavButton
                                    template="dropdown-item menu-text"
                                    page="/"
                                    option="true"
                                >
                                    Logout
                                </NavButton>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <section>
                <Outlet />
            </section>
        </>
    );
}
