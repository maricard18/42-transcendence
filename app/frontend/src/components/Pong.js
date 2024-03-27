import React, { useEffect, useRef, useContext } from "react";
import { startGame } from "../Game/pongGameCode";
import { AuthContext } from "./Context";
import "bootstrap/dist/css/bootstrap.css";

export default function PongPage() {
    const canvasRef = useRef(null);
	const { setAuthed } = useContext(AuthContext);

    useEffect(() => {
		const startPongGame = async () => {
			const canvas = canvasRef.current;
			startGame(canvas, setAuthed);
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
