import React from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="center">
            <h1 className="header">Transcendence</h1>
            <h6 className="subheader">
                Play Beyond Your Limits, Play Transcendence
            </h6>
            <div>
                <Button template="primary-button" page="sign-up/">
                    Sign up
                </Button>
                <br></br>
                <Button template="secondary-button">Sign up with 42</Button>
            </div>
            <p>
                Already have an account?{" "}
                <Link to="login/" className="login">
                    Log in
                </Link>
            </p>
        </div>
    );
}
