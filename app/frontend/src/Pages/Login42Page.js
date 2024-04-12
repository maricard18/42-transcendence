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

    useEffect(() => {
        const call42api = async () => {
			const query = window.location.search;

            const response = await fetchData(
                "/api/sso/101010/callback" + query + "&action=register",
                "GET",
                null
            );

            if (response.ok) {
                await setToken(response, setAuthed);
                navigate("/menu");
            } else {
				if (response.status === 409) {
					await setToken(response, setAuthed);
					navigate("/create-profile/42");
				} else {
					console.error("Error: failed to sign up with 42");
					navigate("/");
				}
            }
        };

        call42api();
    }, []);

    return (
        <div className="container">
            <LoadingIcon size="5rem" />
        </div>
    );
}
