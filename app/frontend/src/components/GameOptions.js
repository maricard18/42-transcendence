import React, { useContext, useEffect } from "react";
import NavButton from "./NavButton";
import { OnQueueContext, PreviousLocationContext } from "./Context";
import { useLocation } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export function GameMenuOptions() {
    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/single-player"
                    >
                        Single Player
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/multiplayer"
                    >
                        Multiplayer
                    </NavButton>
                </div>
                <div>
                    <NavButton template="secondary-button" page="/menu">
                        Back
                    </NavButton>
                </div>
            </div>
        </div>
    );
}

export function SinglePlayerOptions() {
    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/play/single-player/1"
                    >
                        Computer
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/play/single-player/2"
                    >
                        2 Players
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/single-player-tournament"
                    >
                        Tournament
                    </NavButton>
                </div>
                <div>
                    <NavButton
                        template="secondary-button"
                        page="/menu/pong-game/options"
                    >
                        Back
                    </NavButton>
                </div>
            </div>
        </div>
    );
}

export function MultiplayerOptions() {
    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/multiplayer/waiting-room/2"
                    >
                        2 Players
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/multiplayer/waiting-room/4"
                    >
                        4 Players
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/multiplayer-tournament"
                    >
                        Tournament
                    </NavButton>
                </div>
                <div>
                    <NavButton
                        template="secondary-button"
                        page="/menu/pong-game/options"
                    >
                        Back
                    </NavButton>
                </div>
            </div>
        </div>
    );
}

export function TournamentOptions() {
    return (
        <div className="d-flex flex-column col-md-6">
            <div className="p-3 p-lg-5 pd-xl-0">
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/play"
                    >
                        4 Players
                    </NavButton>
                </div>
                <div className="mb-3">
                    <NavButton
                        template="primary-button"
                        page="/menu/pong-game/play"
                    >
                        8 Players
                    </NavButton>
                </div>
                <div>
                    <NavButton
                        template="secondary-button"
                        page={-1}
                    >
                        Back
                    </NavButton>
                </div>
            </div>
        </div>
    );
}
