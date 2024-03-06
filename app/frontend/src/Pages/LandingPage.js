import React from "react";
import NavButton from "../components/NavButton";
import { Link } from "react-router-dom";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function LandingPage() {
    return (
        <section className="center">
            <div className="container">
                <h1 className="header">Transcendence</h1>
                <h6 className="sub-header mb-5">
                    Play Beyond Your Limits, Play Transcendence
                </h6>
                <div className="row justify-content-center mb-1">
                    <NavButton template="primary-button" page="/sign-up">
                        Sign up
                    </NavButton>
                </div>
                <div className="row justify-content-center mb-1">
                    <NavButton template="secondary-button">
                        Sign up with 42
                    </NavButton>
                </div>
                <div className="row justify-content-center mb-1">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="login">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
