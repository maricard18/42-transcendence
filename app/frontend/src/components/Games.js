import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function Game1() {
    const location = useLocation();
    let gameSelected = false;

    if (location.pathname == "/menu" || location.pathname == "/menu/") {
        gameSelected = true;
	}

    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                {gameSelected && (
                    <Link to="/menu/pong-game/options">
                        <img
                            className="square game"
                            src="/static/images/pong.png"
                        />
                    </Link>
                )}
                {!gameSelected && (
                    <img className="square" src="/static/images/pong.png" />
                )}
            </div>
        </div>
    );
}

export function Game2() {
    const location = useLocation();
    let gameSelected = false;

    if (location.pathname == "/menu" || location.pathname == "/menu/") {
		gameSelected = false;
		//! gameSelected = true;
	}
	
    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                {gameSelected && (
                    <Link to="/menu/pong-game/options">
                        <img
                            className="square game"
                            src="/static/images/pong.png"
                        />
                    </Link>
                )}
                {!gameSelected && (
                    <img className="square" src="/static/images/pong.png" />
                )}
            </div>
        </div>
    );
}
