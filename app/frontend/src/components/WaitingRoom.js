import React, { useContext, useEffect, useState } from "react";
import {
    AuthContext,
    UserInfoContext,
    UserQueueContext,
    OnQueueContext,
} from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import { connectWebsocket, sendMessage, ws } from "../functions/websocket";
import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import { logError } from "../functions/utils";
import { BaseAvatar } from "./Avatar";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function MultiplayerWaitingRoom() {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const lobbySize = location.substring(location.length - 1);
    const { setOnQueue } = useContext(OnQueueContext);
    const { setAuthed } = useContext(AuthContext);
    const { userQueue, setUserQueue } = useContext(UserQueueContext);
    const [userReadyList, setUserReadyList] = useState({});

    useEffect(() => {
        const startConnectingProcess = async () => {
            await connectWebsocket(setAuthed, setUserQueue, setUserReadyList);
        };

        startConnectingProcess();
        setOnQueue(true);
    }, []);

    useEffect(() => {
        if (
            Object.keys(userQueue).length == lobbySize &&
            Object.keys(userReadyList).length == lobbySize
        ) {
            const allUsersReady = Object.values(userReadyList).every(
                (ready) => ready
            );
            if (allUsersReady) {
                navigate("/menu/pong-game/play/multiplayer/" + lobbySize);
            }
        }
    }, [userReadyList]);

    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="mb-4">
                    <h3>Waiting for players</h3>
                </div>
                <PlayerQueue>{userQueue}</PlayerQueue>
                {Object.keys(userQueue).length == lobbySize && (
                    <ReadyButton
                        userReadyList={userReadyList}
                        setUserReadyList={setUserReadyList}
                    />
                )}
            </div>
        </div>
    );
}

function PlayerQueue({ children }) {
    const { setAuthed } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await Promise.all(
                Object.values(children).map((value) =>
                    getUserData(value, setAuthed)
                )
            );
            setUserData(data);
        };

        fetchUserData();
    }, [children]);

    return (
        <div className="d-flex flex-column justify-content-start align-items-start mb-3">
            {userData.map((data, index) =>
                data ? (
                    data.avatar ? (
                        <React.Fragment key={index}>
                            <div className="d-flex flex-row mb-2">
                                <img
                                    src={data.avatar}
                                    alt="Avatar preview"
                                    width="40"
                                    height="40"
                                    className="avatar-border-sm"
                                    style={{ borderRadius: "50%" }}
                                />
                                <div className="username-text ms-3 mt-2">
                                    <h5>{data.username}</h5>
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment key={index}>
                            <div className="d-flex flex-row mb-2">
                                <BaseAvatar
                                    width="40"
                                    height="40"
                                    template=""
                                />
                                <div className="username-text ms-3 mt-2">
                                    <h5>{data.username}</h5>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                ) : null
            )}
        </div>
    );
}

function ReadyButton({ userReadyList, setUserReadyList }) {
    const { userInfo } = useContext(UserInfoContext);
    const [readyState, setReadyState] = useState(false);
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
            setUserReadyList({ ...userReadyList, [userInfo.id]: true });
            setReadyState(true);
        } else {
            setUserReadyList({ ...userReadyList, [userInfo.id]: false });
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

async function getUserData(value, setAuthed) {
    let jsonData;

    const headers = {
        Authorization: `Bearer ${await getToken(setAuthed)}`,
    };

    const response = await fetchData("/api/users/" + value, "GET", headers);

    if (!response.ok) {
        logError("failed to fetch user data.");
        return null;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        logError("failed to parse response.");
        return null;
    }

    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
        id: value,
    };

    if (jsonData["avatar"]) {
        data["avatar"] = jsonData["avatar"]["link"];
    }

    return data;
}
