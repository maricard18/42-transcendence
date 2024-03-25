import React, { useEffect, useRef } from "react";
import { startGame } from "../Game/pongGameCode";
import "bootstrap/dist/css/bootstrap.css";

export default function PongGame() {
    const canvasRef = useRef(null);

    useEffect(() => {
		const canvas = canvasRef.current;
		startGame(canvas);
    }, []);

    return (
        <canvas
            width="600"
            height="600"
            style={{ border: "3px solid #ffffff" }}
            ref={canvasRef}
        />
    );
}
