import React, { useEffect, useRef, useContext } from "react";
import { startGame } from "../Game/pongGameCode";
import { useLocation } from "react-router-dom";
import { UserInfoContext, UserQueueContext } from "../components/Context";
import "bootstrap/dist/css/bootstrap.css";

export default function PongPage() {
    const canvasRef = useRef(null);
	const location = useLocation().pathname;
	const gameMode = location.match(/\/([^\/]+)\/[^\/]+$/)[1];
    const lobbySize = location.substring(location.length - 1);
	const { userInfo } = useContext(UserInfoContext);
	const { userQueue } = useContext(UserQueueContext);

    useEffect(() => {
		const startPongGame = async () => {
			const canvas = canvasRef.current;
			startGame(canvas, gameMode, lobbySize, userInfo, userQueue);
		};

		startPongGame();
    }, []);

    return (
        <div className="center">
            <canvas
                width="650"
                height="600"
                style={{ border: "3px solid #ffffff" }}
                ref={canvasRef}
            />
        </div>
    );
}
