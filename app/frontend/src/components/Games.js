import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";
	
export function Game1() {
	const location = useLocation();
	let template = "";

	if (location.pathname == "/menu" || location.pathname == "/menu/")
		template = "game"

    return (
        <div className="d-flex flex-column">
            <div className="p-3 p-lg-5 pd-xl-0">
                <Link to="/menu/pong-game/options">
                    <img
                        className={`square ${template}`}
                        src="/static/images/pong.png"
                    />
                </Link>
            </div>
        </div>
    );
}

export function Game2() {
	const location = useLocation();
	let template = "";

	if (location.pathname == "/menu" || location.pathname == "/menu/")
		template = "game"

	return (
        <div className="d-flex flex-column">
            <div className="p-3 p-lg-5 pd-xl-0">
                <Link to="">
                    <img
                        className={`square ${template}`}
                        src="/static/images/pong.png"
                    />
                </Link>
            </div>
        </div>
    );
}