import React, { useContext, useEffect, useState } from "react";
import {  UserInfoContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import { connectWebsocket } from "../functions/websocket";
import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import { logError } from "../functions/utils";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function MultiplayerWaitingRoom() {
	const location = useLocation().pathname;
	const navigate = useNavigate();
    const { setAuthed } = useContext(UserInfoContext);
    const [userQueue, setUserQueue] = useState({});
	var players = location.substring(location.length - 1);
	console.log(location);
	console.log(players);

    useEffect(() => {
        const startConnectingProcess = async () => {
            await connectWebsocket(setAuthed, setUserQueue);
        };

        startConnectingProcess();
    }, []);

    if (Object.keys(userQueue).length == players)
		navigate("/menu/pong-game/play");

    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <h6>Waiting for players ...</h6>
                <div className="mb-3">
                    <PlayerQueue>{userQueue}</PlayerQueue>
                </div>
            </div>
        </div>
    );
}

function PlayerQueue({ children }) {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await Promise.all(
                Object.values(children).map((value) => getUserData(value))
            );
            setUserData(data);
        };

        fetchUserData();
    }, [children]);

    return (
        <div className="mb-3">
            {userData.map((data, index) => (
                <p key={index}>{data.username}</p>
            ))}
        </div>
    );
}

async function getUserData(value) {
    let jsonData;
    const accessToken = await getToken();
    const response = await fetchData("/api/users/" + value, "GET", {
        "Content-type": "application/json",
        Authorization: "Bearer " + accessToken,
    });

    if (!response.ok) {
        logError("failed to fetch user data.");
        return null;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        logError("failed to parse response -> ", error);
        return null;
    }

    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
        id: value,
    };

    return data;
}
