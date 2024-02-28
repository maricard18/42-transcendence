import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function PongGame() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1000, 600);
    }, []);

    return (
        <canvas
            width="1000"
            height="600"
            style={{ border: "3px solid #ffffff" }}
            ref={canvasRef}
        />
    );
}
