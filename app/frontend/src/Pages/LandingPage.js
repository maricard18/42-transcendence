import React from "react";
import NavButton from "../components/NavButton";
import { Link } from "react-router-dom";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function LandingPage() {
    return (
        <div className="container">
            <div className="center">
                <div className="d-flex flex-column justify-content-center">
                    <h1 className="header">Transcendence</h1>
                    <h6 className="sub-header mb-5">
                        Play Beyond Your Limits, Play Transcendence
                    </h6>
                    <div className="mb-1">
                        <NavButton template="primary-button" page="/sign-up">
                            Sign up
                        </NavButton>
                    </div>
                    <div className="mb-1">
                        <NavButton template="secondary-button">
                            Sign up with 42
                        </NavButton>
                    </div>
                    <div className="mb-1">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="login">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
