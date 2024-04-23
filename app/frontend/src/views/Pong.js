import AbstractView from "./AbstractView";
import { createGameObject } from "../Game/pongGame";
import { startGame } from "../Game/pongGame";
import { closeWebsocket } from "../functions/websocket";
import { navigateTo } from "..";

export default class Pong extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
		this._gameRunning = false;
		this._location = location.pathname;
		this._gameMode = this._location.match(/\/([^\/]+)\/[^\/]+$/)[1];
		this._lobbySize = this._location.substring(this._location.length - 1);
		AbstractView.previousLocation = this._location;
		this._aspectRatioRectangle = 4 / 3;
    	this._aspectRatioSquare = 1;
		this._maxWidth = 1280,
        this._maxHeight = 960;
    	this._minWidth = 640,
        this._minHeight = 480;
    	this._aspectRatio;
		this._width;
		this._height;
		this._game;

		this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
			console.log("Going to refresh the page")
			this._observer.disconnect();
        };

		if (this._gameMode === "single-player" ||
       	   (this._gameMode === "multiplayer" && this._lobbySize == 2)) {
        	this._aspectRatio = this._aspectRatioRectangle;
		} else if (this._gameMode === "multiplayer" && this._lobbySize == 4) {
			this._aspectRatio = this._aspectRatioSquare;
		}

		if (window.innerWidth / window.innerHeight > this._aspectRatio) {
			this._height = window.innerHeight - 300;
			if (this._height > this._maxHeight) {
				this._height = this._maxHeight;
			} else if (this._height < this._minHeight) {
				this._height = this._minHeight;
			}
			this._width = this._height * this._aspectRatio;
		} else {
			this._width = window.innerWidth - 300;
			if (this._width > this._maxWidth) {
				this._width = this._maxWidth;
			} else if (this._width < this._minWidth) {
				this._width = this._minWidth;
			}
			this._height = this._width / this._aspectRatio;
		}
    }

	async defineCallback() {
        const parentNode = document.getElementById("pong");
        if (parentNode) {
            this._parentNode = parentNode;
			if (!this._gameRunning && !AbstractView.gameOver) {
				this._gameRunning = true;
				await this.startPongGame();
				this.loadDOMChanges();
			}
        } else {
            return;
        }
    }

	async startPongGame() {
		if (this._gameMode === "single-player" ||
			(this._gameMode === "multiplayer" &&
			Object.values(AbstractView.userQueue).length == this._lobbySize)) {
			const canvas = document.querySelector("canvas");
			this._game = createGameObject(canvas, this._gameMode, this._lobbySize);
			await startGame(this._game);
		} else {
			console.log("You refreshed the page");
			AbstractView.cleanGameData();
			AbstractView.gameOver = true;
		}
	};

	loadDOMChanges() {
		const parentNode = document.getElementById("pong");
		if (parentNode) {
			parentNode.outerHTML = this.loadPong();
		}
	}

	loadPong() {
		return `
			<div class="outlet-padding center" id="pong">
				${!AbstractView.gameOver ? (
					`<div>
						${(new DisplayUsernames()).getHtml()}
						<canvas
							width="${this._width}"
							height="${this._height}"
							class="mt-3"
							style="border: 3px solid #ffffff"
						/>
					</div>`
				) : (
					'<h1>Game Over</h1>'
				)}
			</div>
        `;
	}

    getHtml() {
		if (AbstractView.gameOver === null) {
			closeWebsocket();
			navigateTo("-1");
		}

        return this.loadPong();
    }
}

class DisplayUsernames extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
		this._callback = false;
		this._location = location.pathname;
		this._gameMode = this._location.match(/\/([^\/]+)\/[^\/]+$/)[1];
		this._lobbySize = this._location.substring(this._location.length - 1);
		AbstractView.previousLocation = this._location;

		this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
			this._observer.disconnect();
        };
    }

	async defineCallback() {
        const parentNode = document.getElementById("display-usernames");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }
    }

	loadDOMChanges() {
		const parentNode = document.getElementById("display-usernames");
		if (parentNode) {
			parentNode.outerHTML = this.loadUsernames();
		}
	}

	loadUsernames() {
		if (this._gameMode === "single-player") {
			return ``;
		} else if (this._gameMode === "multiplayer" && this._lobbySize == 2) {
			return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					${AbstractView.userData[0].avatar
						?	`<div>
								<img
									src=${AbstractView.userData[0].avatar}
									alt="Avatar preview"
									width="40"
									height="40"
									class="avatar-border-sm"
									style="border-radius: 50%"
								/>
								<div class="username-text ms-3 mt-2">
									<h5>${AbstractView.userData[0].username}</h5>
								</div>
							</div>`
						:	`<div>
								<base-avatar-box size="40px"></base-avatar-box>
								<div class="username-text ms-3 mt-2">
									<h5>${AbstractView.userData[0].username}</h5>
								</div>
							</div>`
					}
					${AbstractView.userData[1].avatar
						?	`<div>
								<img
									src=${AbstractView.userData[1].avatar}
									alt="Avatar preview"
									width="40"
									height="40"
									class="avatar-border-sm"
									style="border-radius: 50%"
								/>
								<div class="username-text ms-3 mt-2">
									<h5>${AbstractView.userData[1].username}</h5>
								</div>
							</div>`
						:	`<div>
								<base-avatar-box size="40px"></base-avatar-box>
								<div class="username-text ms-3 mt-2">
									<h5>${AbstractView.userData[1].username}</h5>
								</div>
							</div>`
					}
				</div>
        	`;
		} else if (this._gameMode === "multiplayer" && this._lobbySize == 4) {
			return ``;
		}
	}

    getHtml() {
        return this.loadUsernames();
    }
}