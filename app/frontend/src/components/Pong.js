import React, { useEffect, useRef, useContext, useState } from "react";
import { startGame } from "../Game/pongGameCode";
import { useLocation, Navigate } from "react-router-dom";
import {
    UserDataContext,
    UserInfoContext,
    UserQueueContext,
} from "../components/Context";
import { MyWebSocket } from "../functions/websocket";
import { BaseAvatar } from "./Avatar";
import "bootstrap/dist/css/bootstrap.css";

export default function PongPage() {
    const canvasRef = useRef(null);
    const location = useLocation().pathname;
    const gameMode = location.match(/\/([^\/]+)\/[^\/]+$/)[1];
    const lobbySize = location.substring(location.length - 1);
    const { userInfo } = useContext(UserInfoContext);
    const { userQueue } = useContext(UserQueueContext);
    const { userData } = useContext(UserDataContext);
    const [gameOver, setGameOver] = useState(false);
    const aspectRatioRectangle = 4 / 3;
    const aspectRatioSquare = 1;
    let aspectRatio, width, height;

    useEffect(() => {
        const startPongGame = async () => {
            const canvas = canvasRef.current;
            await startGame(
                canvas,
                gameMode,
                lobbySize,
                userInfo,
                userQueue,
                userData,
                gameOver,
                setGameOver
            );
        };

        if (
            gameMode === "multiplayer" &&
            Object.keys(userQueue).length != lobbySize
        ) {
            if (MyWebSocket.ws) {
                console.log("Here closing a websocket!");
                MyWebSocket.ws.close();
                delete MyWebSocket.ws;
            }
            setGameOver(true);
        } else {
            startPongGame();
        }
    }, []);

    if (
        gameMode === "single-player" ||
        (gameMode === "multiplayer" && lobbySize == 2)
    ) {
        aspectRatio = aspectRatioRectangle;
    } else if (gameMode === "multiplayer" && lobbySize == 4) {
        aspectRatio = aspectRatioSquare;
    }

    if (window.innerWidth / window.innerHeight > aspectRatio) {
        height = window.innerHeight - 250;
        width = height * aspectRatio;
    } else {
        width = window.innerWidth - 250;
        height = width / aspectRatio;
    }

    return (
        <div className="outlet-padding center">
            {!gameOver ? (
                <div>
                    {userQueue && gameMode === "multiplayer" ? (
                        <div className="d-flex flex-column">
                            {displayUsernames(lobbySize, userData)}
                        </div>
                    ) : null}
                    <canvas
                        width={width}
                        height={height}
                        className="mt-3"
                        style={{ border: "3px solid #ffffff" }}
                        ref={canvasRef}
                    />
                </div>
            ) : (
                <Navigate to="/menu" />
            )}
        </div>
    );
}

function displayUsernames(lobbySize, userData) {
    if (lobbySize == 2) {
        return (
            <div className="d-flex flex-row">
                {userData.map((data, index) =>
                    data.avatar ? (
                        <React.Fragment key={index}>
                            <div>
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
                            <div>
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
                )}
            </div>
        );
    }

    return <div>Lobby size is not 2</div>;
}
