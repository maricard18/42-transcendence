import AbstractView from "../views/AbstractView";
import { navigateTo } from "..";

export class Game1 extends AbstractView {
    static gameSelected = false;

    constructor() {
        super();
        this._callbackRunned = false;

        if (location.pathname !== "/home" && location.pathname !== "/home/") {
            Game1.gameSelected = true;
        }

        if (location.pathname === "/home" || location.pathname === "/home/") {
            this._observer = new MutationObserver(this.loadCallbacks);
            this._observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    loadCallbacks = () => {
        if (this._callbackRunned || Game1.gameSelected) {
            return;
        }

        this.handleGameClick = (event) => {
            event.preventDefault();
            const a = document.getElementById("pong-a");
            const href = a.getAttribute("href");
            Game1.gameSelected = true;
            this.removeCallbacks();
            navigateTo(href);
        }

        const img = document.getElementById("pong-img");
        if (img) {
            this._callbackRunned = true;
            img.addEventListener("click", this.handleGameClick);
        }
    }

    removeCallbacks() {
        this._observer.disconnect();

        const img = document.getElementById("pong-img");
        if (img) {
            img.removeEventListener("click", this.handleGameClick);
        }
    }

    async getHtml() {
        if (location.pathname === "/home") {
            Game1.gameSelected = false;
        }

        if (Game1.gameSelected) {
            return `
				<div class="d-flex flex-column col-md-6">
					<div class="p-3 p-lg-5 pd-xl-0">
						<img
							id="pong-img"
							class="square"
							alt="pong game"
							src="/static/images/pong.png"
						/>
					</div>
				</div>
			`;
        } else {
            return `
				<div class="d-flex flex-column col-md-6">
					<div class="p-3 p-lg-5 pd-xl-0">
						<a
							id="pong-a"
							href="/home/pong"
						>
							<img
								id="pong-img"
								class="square game"
								alt="pong game"
								src="/static/images/pong.png"
							/>
						</a>
					</div>
				</div>
			`;
        }
    }
}

export class Game2 extends AbstractView {
    static gameSelected = false;

    constructor() {
        super();
        this._callbackRunned = false;

        if (location.pathname !== "/home" && location.pathname !== "/home/") {
            Game2.gameSelected = true;
        }

        if (location.pathname === "/home" || location.pathname === "/home/") {
            this._observer = new MutationObserver(this.loadCallbacks);
            this._observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    loadCallbacks = () => {
        if (this._callbackRunned || Game2.gameSelected) {
            return;
        }

        this.handleGameClick = (event) => {
            event.preventDefault();
            const a = document.getElementById("tic-tac-toe-a");
            const href = a.getAttribute("href");
            Game2.gameSelected = true;
            this.removeCallbacks();
            navigateTo(href);
        }

        const img = document.getElementById("tic-tac-toe-img");
        if (img) {
            this._callbackRunned = true;
            img.addEventListener("click", this.handleGameClick);
        }
    }

    removeCallbacks() {
        this._observer.disconnect();

        const img = document.getElementById("tic-tac-toe-img");
        if (img) {
            img.removeEventListener("click", this.handleGameClick);
        }
    }

    async getHtml() {
        if (location.pathname === "/home") {
            Game2.gameSelected = false;
        }

        if (Game2.gameSelected) {
            return `
				<div class="d-flex flex-column col-md-6">
					<div class="p-3 p-lg-5 pd-xl-0">
						<img
							class="square"
							alt="tic tac toe game"
							src="/static/images/tictactoe.png"
						/>
					</div>
				</div>
        	`;
        } else {
            return `
				<div class="d-flex flex-column col-md-6">
					<div class="p-3 p-lg-5 pd-xl-0">
						<a
							id="tic-tac-toe-a"
							href="/home/tic-tac-toe"
							disabeld
						>
						<img
							id="tic-tac-toe-img"
							class="square game"
							alt="tic tac toe game"
							src="/static/images/tictactoe.png"
						/>
						</a>
					</div>
				</div>
			`;
        }
    }
}
