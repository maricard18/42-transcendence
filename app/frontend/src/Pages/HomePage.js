import React from "react";
import NavButton from "../components/NavButton";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function HomePage() {
 return (
        <div className="center">
            <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-column me-5">
                    <div className="mb-3">
                        <h1>Pong Game</h1>
                    </div>
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <img
                            className="square"
                            src="../../static/images/pong.png"
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <NavButton
                            template="primary-button btn-small"
                            page="pong-game"
                        >
                            Play
                        </NavButton>
                    </div>
                </div>
                <div className="d-flex flex-column ms-5">
                    <div className="d-flex flex-row justify-content-center mb-3">
                        <h1>Game 2</h1>
                    </div>
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <img
                            className="square"
                            src="../../static/images/pong.png"
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <NavButton
                            template="primary-button btn-small"
                            page=""
                        >
                            Play
                        </NavButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
