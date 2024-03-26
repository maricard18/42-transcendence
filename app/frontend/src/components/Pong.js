import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startGame } from "../Game/pongGameCode";
import "bootstrap/dist/css/bootstrap.css";

export default function PongPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        startGame(canvas);
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