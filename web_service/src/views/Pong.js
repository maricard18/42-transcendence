import AbstractView from "./AbstractView";
import { navigateTo } from "..";
import { closeWebsocket } from "../functions/websocket";
import { createPongGameObject, startPong } from "../Game/Pong/pongGame";
import { Display2Usernames, DisplayUsername } from "../Game/Pong/DisplayUsernames";

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
			if (this._lobbySize == 2) {
				localStorage.setItem("player1", "Opponent");
			} else {
				localStorage.setItem("player2", "CPU");
			}	
			localStorage.setItem("game_status", "loading");
		} else if (this._gameMode === "tournament") {
			localStorage.setItem("game_status", "loading");
		}

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        if (this._gameMode === "single-player" || this._gameMode === "tournament" ||
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

    defineCallback = async () => {
        const parentNode = document.getElementById("pong");
        if (parentNode) {
            this._parentNode = parentNode;
            if (!this._gameRunning) {
                this._gameRunning = true;
                await this.startPongGame();
				await this.gameOverScreen();
            }
        }
    }

    async startPongGame() {
        if (this._gameMode === "single-player" || this._gameMode === "tournament" ||
           (this._gameMode === "multiplayer" && Object.values(AbstractView.userQueue).length == this._lobbySize)) {
			const canvas = document.querySelector("canvas");
            this._game = createPongGameObject(
                canvas,
                this._gameMode,
                this._lobbySize
            );
            await startPong(this._game);
        }
    }

	async gameOverScreen() {
		const canvas = document.querySelector("canvas");
		if (!canvas) {
			return ;
		}
		
		const ctx = canvas.getContext("2d");
		const headlineSize = this._height * 0.12;
		const paragraphSize = this._height * 0.03
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.font = `bold ${headlineSize}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 7 * 3);
	
		ctx.font = `bold ${paragraphSize}px Arial`;
		ctx.fillText("Click anywhere on the canvas to leave this page", canvas.width / 2, canvas.height / 4 * 3);
	
		canvas.addEventListener("click", async () => {
			if (this._gameMode === "tournament") {
				this._observer.disconnect();
				navigateTo("/home/pong/tournament/matchmaking");
			} else {
				localStorage.removeItem("game_status");
				localStorage.removeItem("game_winner");
				AbstractView.cleanGameData();
				closeWebsocket();
				this._observer.disconnect();
				await navigateTo("/home");
			}
		});
	}

    loadPong() {
        return `
			<div class="outlet-padding center" id="pong">
				<div class="d-flex flex-column">
					${new Display2Usernames().getHtml()}
					<canvas
						id="gameCanvas"
						width="${this._width}"
						height="${this._height}"
						class="mt-3"
						style="border: 10px solid #fff; border-radius: 15px; background-color: rgba(0, 0, 0, 0.6)"
					></canvas>
				</div>
			</div>
        `;
    }

    load4Pong() {
        return `
			<div class="outlet-padding center" id="pong">
				<div>
					${new DisplayUsername().getHtml("player3")}
					<div class="d-flex flex-row">
						${new DisplayUsername().getHtml("player1")}
						<div class="d-flex flex-column">
							<canvas
								width="${this._width}"
								height="${this._height}"
								class="mt-3"
								style="border: 10px solid #fff; border-radius: 15px; background-color: rgba(0, 0, 0, 0.6)"
							/>
						</div>
						${new DisplayUsername().getHtml("player2")}
					</div>
					${new DisplayUsername().getHtml("player4")}
				</div>
			</div>
        `;
    }

    async getHtml() {
        if (this._gameMode === "multiplayer" && 
		   (!localStorage.getItem("game_status") || !AbstractView.userData.length)) {
			localStorage.removeItem("game_status");
			localStorage.removeItem("game_winner");
			AbstractView.cleanGameData();
			closeWebsocket();
			this._observer.disconnect();
			await navigateTo("/home");
			return ;
        } else if (this._gameMode === "tournament") {
			if (!localStorage.getItem("tournament")) {
				localStorage.removeItem("game_status");
				this._observer.disconnect();
				await navigateTo("/home");
				return ;
			}
			if (currentGameFinished()) {
				this._observer.disconnect();
				await navigateTo("/home/pong/tournament/matchmaking");
				return ;
			}
		}

        if (this._lobbySize != 4) {
            return this.loadPong();
        } else {
            return this.load4Pong();
        }
    }
}

function currentGameFinished() {
	let match1 = JSON.parse(localStorage.getItem("match1"));
	let match2 = JSON.parse(localStorage.getItem("match2"));
	let match3 = JSON.parse(localStorage.getItem("match3"));

	if (match1 && match1["status"] === "finished" && !match2) {
		return true;
	} else if (match2 && match2["status"] === "finished" && !match3) {
		return true;
	} else if (match3 && match3["status"] === "finished") {
		return true;
	}

	return false;
}