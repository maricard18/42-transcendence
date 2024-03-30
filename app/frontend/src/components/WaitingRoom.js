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
    const { userInfo } = useContext(UserInfoContext);
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
        if (!readyState && userReadyList[userInfo.id]) {
            setUserReadyList((prevState) => {
                const newState = { ...prevState };
                delete newState[userInfo.id];
                return newState;
            });
        }
    }, [readyState]);

    useEffect(() => {
        if (
            Object.keys(userQueue).length == lobbySize &&
            Object.keys(userReadyList).length == lobbySize
        ) {
            const allUsersReady = Object.values(userReadyList).every(
                (ready) => ready
            );
            if (allUsersReady) {
                navigate("/menu/pong-game/play");
            }
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
                        />
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

function ReadyButton({ readyState, setReadyState }) {
    const { userInfo } = useContext(UserInfoContext);
    let template;
	
    useEffect(() => {
		const message = {
			state: {
				[userInfo.id]: readyState,
            },
        };
        sendMessage(ws, message);
    }, [readyState]);

	if (readyState) {
		template = "secondary-button";
	} else {
		template = "primary-button";
	}

    function handleClick() {
        if (!readyState) {
            setReadyState(true);
        } else {
            setReadyState(false);
        }
    }

    return (
        <div className="mb-3">
            <button
                type="button"
                className={`btn btn-primary ${template}`}
                onClick={() => {
                    handleClick();
                }}
            >
                {!readyState && "Ready"}
                {readyState && "Not Ready"}
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
