import React, { useEffect, useState, useContext } from "react";
import NavButton from "../components/NavButton";
import { Link } from "react-router-dom";
import fetchData from "../functions/fetchData";
import { LoadingIcon } from "../components/Icons";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function LandingPage() {
    const [link, setLink] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const createLink = async () => {
            const response = await fetchData(
                "/get-env-vars",
                "GET",
                null,
                null
            );

            if (response.ok) {
                const data = await response.json();

                let url = "https://api.intra.42.fr/oauth/authorize";
                url += "?client_id=" + encodeURIComponent(data["client_id"]);
                url += "&redirect_uri=" + encodeURIComponent(data["redirect_uri"]);
                url += "&response_type=code";

                setLink(url);
                setLoading(false);
            } else {
                console.log("Error getting env vars!");
				setLoading(false);
            }
        };

		createLink();
    }, []);

    return (
        <div className="container">
            {!loading ? (
                <div className="center">
                    <div className="d-flex flex-column justify-content-center">
                        <h1 className="header">Transcendence</h1>
                        <h6 className="sub-header mb-5">
                            Play Beyond Your Limits, Play Transcendence
                        </h6>
                        <div className="mb-2">
                            <NavButton
                                template="primary-button"
                                page="/sign-up"
                            >
                                Sign up
                            </NavButton>
                        </div>
                        <div className="mb-2">
                            <NavButton template="secondary-button" page={link}>
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
            ) : (
                <LoadingIcon size="4rem" />
            )}
        </div>
    );
}
