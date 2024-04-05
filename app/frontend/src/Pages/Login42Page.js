import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { setToken } from "../functions/tokens";
import { AuthContext } from "../components/Context";
import { LoadingIcon } from "../components/Icons";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function Login42Page() {
    const navigate = useNavigate();
    const { setAuthed } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const call42api = async () => {
            const query = window.location.search;

            const response = await fetchData(
                "/api/sso/101010/callback" + query,
                "GET",
                null
            );

            if (response.ok) {
                await setToken(response, setAuthed);
                setLoading(false);
                navigate("/menu");
            } else {
                setLoading(false);
				navigate("/create-profile-42");
            }
        };

        call42api();
    }, []);

    return (
        <div className="container">
            {!loading ? (
                <div className="d-flex justify-content-center">
                    <LoadingIcon size="4rem" />
                </div>
            ) : null}
        </div>
    );
}
