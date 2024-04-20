import AbstractView from "../views/AbstractView";

export class GameMenuOptions extends AbstractView {
    constructor() {
        super();
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="/home/pong-game/single-player"
						value="Single Player"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
						page="/home/pong-game/multiplayer"
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
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/play/single-player/1"
						value="Computer"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/play/single-player/2"
						value="2 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/single-player/tournament"
						value="Tournament"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
                        page="/home/pong-game"
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
        this.setTitle("Menu");
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/multiplayer/waiting-room/2"
						value="2 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/multiplayer/waiting-room/4"
						value="4 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/multiplayer/tournament"
						value="Tournament"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
                        page="/home/pong-game"
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
        this.setTitle("Menu");
    }

    async getHtml() {
        return `
		<div class="d-flex flex-column col-md-6">
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/play"
						value="2 Players"
					></nav-button>
				</div>
				<div class="mb-3">
					<nav-button
						template="primary-button extra-btn-class"
                        page="/home/pong-game/play"
						value="4 Players"
					></nav-button>
				</div>
				<div>
					<nav-button 
						template="secondary-button extra-btn-class" 
                        page="-1"
						value="Back"
					></nav-button>
				</div>
			</div>
		</div>
        `;
    }
}