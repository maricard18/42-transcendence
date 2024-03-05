import React from "react";
import SubmitButton from "../components/SubmitButton";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function MenuPage() {
    function onClick() {
        console.log("Button clicked");
    }

    return (
        <div className="center">
            <div className="row justify-content-center">
                <div className="col justify-content-center me-5">
                    <div className="row mb-3">
                        <h1>Pong Game</h1>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <img
                            className="square"
                            src="../../static/images/pong.png"
                        />
                    </div>
                    <div className="row justify-content-center">
                        <SubmitButton
                            template="primary-button btn-small"
                            onClick={onClick}
                        >
                            Play
                        </SubmitButton>
                    </div>
                </div>
                <div className="col justify-content-center ms-5">
                    <div className="row justify-content-center mb-3">
                        <h1>Game 2</h1>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <img
                            className="square"
                            src="../../static/images/pong.png"
                        />
                    </div>
                    <div className="row justify-content-center">
                        <SubmitButton
                            template="primary-button btn-small"
                            onClick={onClick}
                        >
                            Play
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
