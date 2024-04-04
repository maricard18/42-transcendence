import React, { useContext, useEffect, useState } from "react";
import {
    AuthContext,
    PreviousLocationContext,
    UserInfoContext,
    UserQueueContext,
} from "./Context";
import {
    connectWebsocket,
    sendMessage,
    MyWebSocket,
} from "../functions/websocket";
import fetchData from "../functions/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../functions/tokens";
import { logError } from "../functions/utils";
import { BaseAvatar } from "./Avatar";
import { CheckIcon, CloseIcon } from "./Icons";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function MultiplayerWaitingRoom() {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const lobbySize = location.substring(location.length - 1);
    const { setAuthed } = useContext(AuthContext);
    const { setPreviousLocation } = useContext(PreviousLocationContext);
    const { userQueue, setUserQueue } = useContext(UserQueueContext);
    const [userReadyList, setUserReadyList] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startConnectingProcess = async () => {
            await connectWebsocket(
                setAuthed,
                setUserQueue,
                setUserReadyList,
                setLoading
            );
        };

        startConnectingProcess();
        setPreviousLocation(location);
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
    }, [userReadyList, userQueue]);

    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="d-flex flex-row mb-4">
                    <h3>Waiting for players</h3>
                    <div className="d-flex justify-content-center">
                        <div
                            className="spinner-border ms-3 mt-2"
                            style={{ width: "20px", height: "20px" }}
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <PlayerQueue
                    userQueue={userQueue}
                    userReadyList={userReadyList}
                />
                {!loading
                    ? Object.keys(userQueue).length == lobbySize && (
                          <ReadyButton
                              userReadyList={userReadyList}
                              setUserReadyList={setUserReadyList}
                          />
                      )
                    : null}
            </div>
        </div>
    );
}

function PlayerQueue({ userQueue, userReadyList }) {
    const { setAuthed } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await Promise.all(
                Object.values(userQueue).map((value) =>
                    getUserData(value, setAuthed)
                )
            );
            setUserData(data);
        };

        fetchUserData();
    }, [userQueue, userReadyList]);

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
                                <div className="d-flex flex-row justify-content-center">
                                    <div className="username-text ms-3 mt-2">
                                        <h5>{data.username}</h5>
                                    </div>
                                    <div className="ms-1 mt-2">
                                        <CheckIfReady
                                            data={data}
                                            userReadyList={userReadyList}
                                        />
                                    </div>
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
                                <div className="d-flex flex-row">
                                    <div className="username-text ms-3 mt-2">
                                        <h5>{data.username}</h5>
                                    </div>
                                    <div className="ms-1 mt-2">
                                        <CheckIfReady
                                            data={data}
                                            userReadyList={userReadyList}
                                        />
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                ) : null
            )}
        </div>
    );
}

function CheckIfReady({ data, userReadyList }) {
    return Object.entries(userReadyList).map(([userId, isReady], index) => {
        if (userId == data.id) {
            if (isReady) {
                return <CheckIcon key={index} />;
            } else {
                return <CloseIcon key={index} />;
            }
        }
    });
}

function ReadyButton({ userReadyList, setUserReadyList }) {
    const { userInfo } = useContext(UserInfoContext);
    const [readyState, setReadyState] = useState(false);
    let template;

    useEffect(() => {
        setUserReadyList({ ...userReadyList, [userInfo.id]: false });
        setReadyState(false);
    }, []);

    useEffect(() => {
        const message = {
            state: {
                [userInfo.id]: readyState,
            },
        };
        sendMessage(MyWebSocket.ws, message);
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
