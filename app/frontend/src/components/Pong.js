import React, { useEffect, useRef, useContext, useState } from "react";
import { startGame } from "../Game/pongGameCode";
import { useLocation, Navigate } from "react-router-dom";
import { UserInfoContext, UserQueueContext } from "../components/Context";
import { MyWebSocket } from "../functions/websocket";
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
            await startGame(
                canvas,
                gameMode,
                lobbySize,
                userInfo,
                userQueue,
				gameOver,
                setGameOver
            );
        };

        if (Object.keys(userQueue).length != lobbySize) {
            if (MyWebSocket.ws) {
                console.log("Closed Websocket");
                MyWebSocket.ws.close();
                delete MyWebSocket.ws;
            }
			setGameOver(true);
        } else {
            startPongGame();
        }
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
