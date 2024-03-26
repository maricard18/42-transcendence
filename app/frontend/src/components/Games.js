import React from "react";
import NavButton from "./NavButton";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function Game1() {
    return (
        <div className="d-flex flex-column">
            <div className="mb-3">
                <h1>Pong Game</h1>
            </div>
            <div className="d-flex flex-row justify-content-center mb-4">
                <img className="square" src="../../static/images/pong.png" />
            </div>
            <div className="d-flex flex-row justify-content-center">
                <NavButton
                    template="primary-button btn-small"
                    page="pong-game/options"
                >
                    Play
                </NavButton>
            </div>
        </div>
    );
}

export function Game2() {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex flex-row justify-content-center mb-3">
                <h1>Game 2</h1>
            </div>
            <div className="d-flex flex-row justify-content-center mb-4">
                <img className="square" src="../../static/images/pong.png" />
            </div>
            <div className="d-flex flex-row justify-content-center">
                <NavButton template="primary-button btn-small" page="">
                    Play
                </NavButton>
            </div>
        </div>
    );
}
