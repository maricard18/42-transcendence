import React, { useContext, useEffect, useState } from "react";
import fetchData from "../functions/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../functions/tokens";
import { BaseAvatar } from "./Avatar";
import { CheckIcon, CloseIcon, LoadingIcon } from "./Icons";
import {
    AuthContext,
    PreviousLocationContext,
    UserDataContext,
    UserInfoContext,
    UserQueueContext,
} from "./Context";
import {
    connectWebsocket,
    sendMessage,
    MyWebSocket,
	closeWebsocket,
} from "../functions/websocket";
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
    const { userData, setUserData } = useContext(UserDataContext);
    const [loading, setLoading] = useState(true);
    const [userReadyList, setUserReadyList] = useState({});
    const [lobbyFull, setLobbyfull] = useState(false);
    const [userLeft, setUserLeft] = useState(false);
    const [wsCreated, setWsCreated] = useState(false);

    useEffect(() => {
        const startConnectingProcess = async () => {
            await connectWebsocket(
                setAuthed,
                setUserQueue,
                setUserReadyList,
                setUserData,
                setWsCreated
            );
            setLoading(false);
        };

        if (userLeft) {
			console.log("Closing this websocket, opponent left");
            closeWebsocket();
            setUserLeft(false);
            setUserData([]);
            setWsCreated(false);
        }

        if (!wsCreated) {
            startConnectingProcess();
        }

        setPreviousLocation(location);
    }, [userLeft, wsCreated]);

    useEffect(() => {
        if (!lobbyFull && Object.keys(userQueue).length == lobbySize) {
            setLobbyfull(true);
        } else if (lobbyFull && Object.keys(userQueue).length != lobbySize) {
            setUserLeft(true);
            setLoading(true);
            setLobbyfull(false);
        }

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
            {loading ? (
                <div className="justify-content-center">
                    <LoadingIcon size="5rem" />
                </div>
            ) : (
                <div className="p-3 p-lg-5 pd-xl-0">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <h3>Waiting for players</h3>
                    </div>
                    <PlayerQueue
                        userQueue={userQueue}
                        userReadyList={userReadyList}
                        lobbySize={lobbySize}
                    />
                    {wsCreated
                        ? Object.keys(userQueue).length == lobbySize && (
                              <ReadyButton
                                  userReadyList={userReadyList}
                                  setUserReadyList={setUserReadyList}
                              />
                          )
                        : null}
                </div>
            )}
        </div>
    );
}

function PlayerQueue({ userQueue, userReadyList, lobbySize }) {
    const { userData, setUserData } = useContext(UserDataContext);
    const { setAuthed } = useContext(AuthContext);
    const { userInfo } = useContext(UserInfoContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await Promise.all(
                Object.values(userQueue).map((value) =>
                    value === userInfo.id
                        ? userInfo
                        : getUserData(value, setAuthed)
                )
            );
            setUserData(data);
            setLoading(false);
        };

        if (Object.values(userData).length != lobbySize) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [userQueue]);

    return (
        <div className="d-flex flex-column justify-content-start align-items-start mb-3">
            {!loading && userData
                ? userData.map((data, index) =>
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
                  )
                : null}
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
        console.log("Error: failed to fetch user data.");
        return null;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        console.log("Error: failed to parse response.");
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
