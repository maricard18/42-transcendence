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
                    <div className="mb-2">
                        <NavButton template="primary-button" page="/sign-up">
                            Sign up
                        </NavButton>
                    </div>
                    <div className="mb-2">
                        <NavButton template="secondary-button" page="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5b992f3110962d31fd7154ccd734a5aafc66c24fab9d5476537c09f0df4efb85&redirect_uri=http%3A%2F%2F10.12.5.7%3A8000%2Flogin%2F42&response_type=code" >
                            Sign up with 42
                        </NavButton>
                    </div>
                    <div className="mt-1">
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
