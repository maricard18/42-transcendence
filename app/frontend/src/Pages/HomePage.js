import React from "react";
import { NavButton } from "../components/Buttons";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="center">
            <h1 className="header">Transcendence</h1>
            <h6 className="subheader">
                Play Beyond Your Limits, Play Transcendence
            </h6>
            <NavButton template="primary-button" page="/sign-up">
                Sign up
            </NavButton>
            <br></br>
            <NavButton template="secondary-button">Sign up with 42</NavButton>
            <p>
                Already have an account?{" "}
                <Link to="/login" className="login">
                    Log in
                </Link>
            </p>
        </div>
    );
}
