import AbstractView from "../views/AbstractView";

export class GameMenuOptions extends AbstractView {
    constructor() {
        super();
        this._game = null;

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/single-player"
                                : "/home/tic-tac-toe/single-player"
                        }"
						value="Single Player"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/multiplayer"
                                : "/home/tic-tac-toe/multiplayer"
                        }"
						value="Multiplayer"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
						page="/home"
						value="Back"
					></nav-button>
				</div>
			</div>
		</div>
        `;
    }
}

export class SinglePlayerOptions extends AbstractView {
    constructor() {
        super();
		this._game = null;

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/play/single-player/1"
                                : "/home/pong/play/single-player/1"
                        }"
						value="Computer"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/play/single-player/2"
                                : "/home/tic-tac-toe/play/single-player/2"
                        }"
						value="2 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/single-player/tournament"
                                : "/home/tic-tac-toe/single-player/tournament"
                        }"
						value="Tournament"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong"
                                : "/home/tic-tac-toe"
                        }"
						value="Back"
					></nav-button>
				</div>
			</div>
		</div>
        `;
    }
}

export class MultiplayerOptions extends AbstractView {
    constructor() {
        super();
        this._game = null;

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/multiplayer/waiting-room/2"
                                : "/home/tic-tac-toe/multiplayer/waiting-room/2"
                        }"
						value="2 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/multiplayer/waiting-room/4"
                                : "/home/tic-tac-toe/multiplayer/waiting-room/4"
                        }"
						value="4 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/multiplayer/tournament"
                                : "/home/tic-tac-toe/multiplayer/tournament"
                        }"
						value="Tournament"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
						page="${
                            this._game === "pong"
                                ? "/home/pong"
                                : "/home/tic-tac-toe"
                        }"
						value="Back"
					></nav-button>
				</div>
			</div>
		</div>
        `;
    }
}

export class TournamentOptions extends AbstractView {
    constructor() {
        super();
        this._game = null;

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="${
                            this._game === "pong"
                                ? "/home/pong/tournament/creation"
                                : "/home/tic-tac-toe/tournament/creation"
                        }"
						value="4 Players"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
                        page="${
                            this._game === "pong"
                                ? "/home/pong/multiplayer"
                                : "/home/tic-tac-toe/multiplayer"
                        }"
						value="Back"
					></nav-button>
				</div>
			</div>
		</div>
        `;
    }
}
