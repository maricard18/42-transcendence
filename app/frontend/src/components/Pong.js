import React, { useEffect, useRef, useContext, useState } from "react";
import { startGame } from "../Game/pongGameCode";
import { useLocation, Navigate } from "react-router-dom";
import { UserInfoContext, UserQueueContext } from "../components/Context";
import "bootstrap/dist/css/bootstrap.css";

export default function PongPage() {
    const canvasRef = useRef(null);
    const location = useLocation().pathname;
    const gameMode = location.match(/\/([^\/]+)\/[^\/]+$/)[1];
    const lobbySize = location.substring(location.length - 1);
    const { userInfo } = useContext(UserInfoContext);
    const { userQueue } = useContext(UserQueueContext);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const startPongGame = async () => {
            const canvas = canvasRef.current;
            startGame(
                canvas,
                gameMode,
                lobbySize,
                userInfo,
                userQueue,
                setGameOver
            );
        };

        startPongGame();
    }, []);

    return (
        <div className="center">
            {!gameOver ? (
                <canvas
                    width="650"
                    height="600"
                    style={{ border: "3px solid #ffffff" }}
                    ref={canvasRef}
                />
            ) : (
                <Navigate to="/menu" />
            )}
        </div>
    );
}
