import React from "react";
import NavButton from "./NavButton";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function MenuOptions() {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex flex-row justify-content-center">
                <NavButton template="primary-button btn-small full-width" page="/menu/pong-game/play">
                    Multiplayer
                </NavButton>
            </div>
            <div className="d-flex flex-row justify-content-center">
                <NavButton template="primary-button btn-small full-width">
                    Tournament
                </NavButton>
            </div>
			<div className="d-flex flex-row justify-content-center">
                <NavButton template="primary-button btn-small full-width">
                    Local Game
                </NavButton>
            </div>
			<div className="d-flex flex-row justify-content-center">
                <NavButton template="primary-button btn-small full-width">
                    Local Tournaments
                </NavButton>
            </div>
			<div className="d-flex flex-row justify-content-center">
                <NavButton template="secondary-button btn-small full-width" page="/menu">
                    Main Menu
                </NavButton>
            </div>
        </div>
    );
}
