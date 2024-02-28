import React from "react";
import PongGame from "../components/PongGame";

export default function PongPage() {
    return (
        <div className="center">
            <h1 className="mb-5">Pong Game</h1>
            <div>
                <PongGame />
            </div>
        </div>
    );
}
