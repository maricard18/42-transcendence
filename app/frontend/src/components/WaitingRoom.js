import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext, UserInfoContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import { connectWebsocket, sendMessage, ws } from "../functions/websocket";
import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import { logError } from "../functions/utils";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function MultiplayerWaitingRoom() {
    const navigate = useNavigate();
	const location = useLocation().pathname;
    const lobbySize = location.substring(location.length - 1);
    const { setAuthed } = useContext(AuthContext);
    const [userQueue, setUserQueue] = useState({});
    const [readyState, setReadyState] = useState(false);
    const [userReadyList, setUserReadyList] = useState({});

    useEffect(() => {
        const startConnectingProcess = async () => {
            await connectWebsocket(setAuthed, setUserQueue, setUserReadyList);
        };

        startConnectingProcess();
    }, []);

    useEffect(() => {
		if (Object.keys(userQueue).length == lobbySize &&
			Object.keys(userReadyList).length == lobbySize) {
			navigate("/menu/pong-game/play");
		}
	}, [userReadyList]);

    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <h6>Waiting for players ...</h6>
                <div className="mb-3">
                    <PlayerQueue>{userQueue}</PlayerQueue>
                    {Object.keys(userQueue).length == lobbySize && (
                        <ReadyButton
                            readyState={readyState}
                            setReadyState={setReadyState}
                        >
                            Ready
                        </ReadyButton>
                    )}
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

function ReadyButton({ readyState, setReadyState, children }) {
    const { userInfo } = useContext(UserInfoContext);

    function handleClick() {
        if (!readyState) {
            setReadyState(true);
            const message = {
                state: {
                    [userInfo.id]: "ready",
                },
            };

            console.log("Sending message to websocket!");
            sendMessage(ws, message);
        }
    }

    console.log("Child component was rendered.");

    return (
        <div className="mb-3">
            <button
                type="button"
                className="btn btn-primary primary-button"
                onClick={() => {
                    handleClick();
                }}
            >
                {children}
            </button>
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
