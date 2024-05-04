import AbstractView from "./AbstractView";
import { createPongGameObject } from "../Game/Pong/pongGame";
import { startPong } from "../Game/Pong/pongGame";
import { Display2Usernames, DisplayUsername } from "../components/DisplayUsernames";
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
        (this._maxWidth = 1280), (this._maxHeight = 960);
        (this._minWidth = 640), (this._minHeight = 480);
        this._aspectRatio;
        this._width;
        this._height;
        this._game;

		if (this._gameMode === "single-player") {
			localStorage.setItem("game_status", "loading");
			AbstractView.gameOver = false;
		}

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

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
				this.gameOverScreen();
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
            this._game = createPongGameObject(
                canvas,
                this._gameMode,
                this._lobbySize
            );
            await startPong(this._game);
        }
    }

	gameOverScreen() {
		const canvas = document.querySelector("canvas");
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.font = "50px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
		//TODO add click event to leave this page
	}

    loadDOMChanges() {
        const parentNode = document.getElementById("pong");
        if (parentNode && this._lobbySize != 4) {
            parentNode.outerHTML = this.loadPong();
        } else if (parentNode) {
			parentNode.outerHTML = this.load4Pong();
		}
    }

	loadPong() {
        return `
			<div class="outlet-padding center" id="pong">
				<div class="d-flex flex-column">
				${
                    !AbstractView.gameOver
                        ?	`${new Display2Usernames().getHtml()}`
						: 	`<style>#pong canvas { position: fixed; top: 0; left: 0; }</style>`
				}
					<canvas
						width="${this._width}"
						height="${this._height}"
						class="mt-3"
						style="border: 10px solid #fff; border-radius: 15px"
					/>
				</div>
			</div>
        `;
    }

    load4Pong() {
        return `
			<div class="outlet-padding center" id="pong">
				<div>
				${
					!AbstractView.gameOver
						?	`${new DisplayUsername().getHtml("player3")}`
						: 	``
				}
					<div class="d-flex flex-row">
					${
						!AbstractView.gameOver
							?	`${new DisplayUsername().getHtml("player1")}`
							: 	``
					}
						<div class="d-flex flex-column">
							<canvas
								width="${this._width}"
								height="${this._height}"
								class="mt-3"
								style="border: 10px solid #fff; border-radius: 15px"
							/>
						</div>
					${
						!AbstractView.gameOver
							?	`${new DisplayUsername().getHtml("player2")}`
							: 	``
					}
					</div>
				${
					!AbstractView.gameOver
						?	`${new DisplayUsername().getHtml("player4")}`
						: 	``
				}
				</div>
			</div>
        `;
    }

    getHtml() {
        if (this._gameMode === "multiplayer" && 
		   (!localStorage.getItem("game_status") || !AbstractView.userData.length)) {
			localStorage.removeItem("game_status");
			AbstractView.cleanGameData();
			navigateTo("/home");
			return ;
        } else {
			AbstractView.gameOver = false;
		}

		if (this._lobbySize != 4) {
			return this.loadPong();
		} else {
			return this.load4Pong();
		}
    }
}
