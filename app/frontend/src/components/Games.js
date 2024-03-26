import React from "react";
import { Link } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function Game1() {
    return (
        <div className="d-flex flex-column">
            <div className="mb-4">
                <Link to="/menu/pong-game/options">
                    <img
                        className="square game"
                        src="/static/images/pong.png"
                    />
                </Link>
            </div>
        </div>
    );
}

export function Game2() {
    return (
        <div className="d-flex flex-column">
            <div className="mb-4">
                <Link to="">
                    <img
                        className="square game"
                        src="/static/images/pong.png"
                    />
                </Link>
            </div>
        </div>
    );
}