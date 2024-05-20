import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import { getToken } from "../functions/tokens";
import { navigateTo } from "..";

export default class ProfilePage extends AbstractView {
    constructor() {
        super();
		const index = location.pathname.lastIndexOf("/");
		this._userId = location.pathname.substring(index + 1);
		this._winRecord = 0;
		this._lossRecord = 0;
        
		this._parentNode = null;
        this._iserInfoCallback = false;

		this._userInfo = null;
		this._matchHistory = null;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

	async getUserMatches() {
		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			`/api/games?filter[user_id]=${this._userInfo.id}`,
			"GET",
			headers,
			null
		);

		if (response.ok) {
			return await response.json();
		} else {
			console.error("Error: failed to get user match history ", response.status);
		}
	}

    async defineCallback() {
        const parentNode = document.getElementById("profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

		if (!this._iserInfoCallback) {
			this._iserInfoCallback = true;

			this._userInfo = await getUserInfo(null, this._userId);
			this._matchHistory = await this.getUserMatches();
			if (!this._userInfo) {
				navigateTo("/home/friends");
			} else {
				await this.loadDOMChanges();
			}
		}
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        this._observer.disconnect();
    }

	getPlayerRecord() {
		for (let [index, match] of this._matchHistory.entries()) {
			for (let [index, player] of Object.entries(match.players)) {
				if (player == this._userId) {
					if (match.game === "pong" && match.results[`${index}`] === 5) {
						this._winRecord++;
					} else if (match.game === "ttt" && match.results[`${index}`] === 1) {
						this._winRecord++;
					} else {
						this._lossRecord++;
					}
				}
			}
		}
	}

	async loadUserInfo(accessToken, users) {
		const playersInfo = [];
		let info;

		for (let [index, id] of Object.entries(users)) {
			if (id === -1) {
				info = {
					username: "CPU",
					avatar: "/static/images/cpu.png"
				}
			} else if (id === -2) {
				info = {
					username: "Opponent",
					avatar: "/static/images/michael-scott.png"
				}
			} else {
				info = await getUserInfo(accessToken, id);
			}

			playersInfo.push(info);
		}

		return playersInfo;
	}

	async loadMatchHistory() {		
		if (!this._matchHistory || !this._matchHistory.length) {
			return `
				<div class="d-flex flex-row justify-content-center align-items-center mt-5">
					<h1 style="font-size: 50px">No match history</h1>
				</div>
			`;
		}
		
		const accessToken = await getToken();
		
		const div = document.createElement("div");
		div.setAttribute("class", "mt-2");
		div.id = "match-history-list";
		div.style.maxHeight = "320px";
		div.style.overflowY = "auto";
		
		for (let [index, match] of this._matchHistory.entries()) {
			const playersInfo = await this.loadUserInfo(accessToken, match.players);
			
			const matchDiv = document.createElement("div");
			matchDiv.setAttribute("class", "d-flex flex-column align-items-center match-history-box mt-3 me-3");
			matchDiv.id = `match-${index}`;

			const gameInfoDiv = document.createElement("div");
			gameInfoDiv.setAttribute("class", "d-flex flex-row justify-content-start w-100 ms-2 mt-1");

			const game = document.createElement("h3");
			game.setAttribute("class", "ms-3 mt-1");
			game.setAttribute("style", "font-size: 20px; font-weight: bold; white-space: nowrap;");
			game.innerText = match.game === "pong" ? "Pong" : "Tic Tac Toe";
			gameInfoDiv.appendChild(game);

			const mode = document.createElement("h3");
			mode.setAttribute("class", "d-flex justify-content-start w-100 ms-3 mt-1");
			mode.setAttribute("style", "font-size: 20px; font-weight: bold");
			mode.innerText = match.type === "single" ? "Single Player" : "Multiplayer";
			gameInfoDiv.appendChild(mode);

			const date = document.createElement("h3");
			date.setAttribute("class", "d-flex justify-content-end w-100 me-4 mt-1");
			date.setAttribute("style", "font-size: 20px; font-weight: bold");
			date.innerText = match.date;
			gameInfoDiv.appendChild(date);

			matchDiv.appendChild(gameInfoDiv);

			const gamePlayersAndResultsDiv = document.createElement("div");
			gamePlayersAndResultsDiv.setAttribute("class", "d-flex flex-row justify-content-start w-100 ms-2");

			const gameImageDiv = document.createElement("div");
			gameImageDiv.setAttribute("class", "d-flex felx-column align-items-start m-3")
			
			const gameImage = document.createElement("img");
			gameImage.setAttribute("alt", "game preview");
			gameImage.setAttribute("class", "img-outline-sm");
			gameImage.setAttribute("width", "125");
			gameImage.setAttribute("height", "125");
			gameImage.setAttribute("src", `/static/images/${match.game === "pong" ? "pong.png" : "tictactoe.png"}`);
			gameImageDiv.appendChild(gameImage);
			
			gamePlayersAndResultsDiv.appendChild(gameImageDiv);

			const playersDiv = document.createElement("div");
			playersDiv.setAttribute("class", "d-flex flex-column align-items-start ms-3 mt-4");

			for (let [index, player] of playersInfo.entries()) {
				const avataraAndUsernameDiv = document.createElement("div");
				avataraAndUsernameDiv.setAttribute("class", `d-flex flex-row align-items-center mt-1 mb-3`);
				avataraAndUsernameDiv.id = `player${index + 1}`;
				
				if (player.avatar) {
					const img = document.createElement("img");
					img.setAttribute("class", "white-border-sm");
					img.setAttribute("alt", "Avatar preview");
					img.setAttribute("width", "40");
					img.setAttribute("height", "40");
					img.setAttribute("style", "border-radius: 50%");
					img.setAttribute("src", player.avatar);
					avataraAndUsernameDiv.appendChild(img);
				} else {
					const avatar = document.createElement("base-avatar-box");
					avatar.setAttribute("template", "ms-3");
					avatar.setAttribute("size", "40");
					avataraAndUsernameDiv.appendChild(avatar);
				}
				
				const username = document.createElement("h3");
				username.setAttribute("class", "ms-3 mt-2");
				username.setAttribute("style", "font-size: 20px; font-weight: bold");
				username.innerText = player.username;
				avataraAndUsernameDiv.appendChild(username);
				
				playersDiv.appendChild(avataraAndUsernameDiv);
			}

			gamePlayersAndResultsDiv.appendChild(playersDiv);

			const playerScoresDiv = document.createElement("div");
			playerScoresDiv.setAttribute("class", "d-flex flex-column align-items-end w-100 mt-4 me-5");

			for (let [index, player] of playersInfo.entries()) {
				const scoreDiv = document.createElement("div");
				scoreDiv.setAttribute("class", `d-flex flex-row align-items-center justify-content-center mt-2`);
				scoreDiv.id = `score${index + 1}`;

				const score = document.createElement("h3");
				score.setAttribute("style", "font-size: 30px; font-weight: bold");
				score.innerText = match.results[`player_${index + 1}`];;
				scoreDiv.appendChild(score);
							
				playerScoresDiv.appendChild(scoreDiv);
			}

			gamePlayersAndResultsDiv.appendChild(playerScoresDiv);
			
			matchDiv.appendChild(gamePlayersAndResultsDiv);
			div.appendChild(matchDiv);
		}
	
		return div.outerHTML;
	}

	async loadProfilePage() {
		let isOnline = AbstractView.onlineStatus[this._userId] || this._userId === AbstractView.userInfo.id;
		this.getPlayerRecord();

		return `
			<div class="center">
				<div class="d-flex flex-column justify-content-start profile-box">
					<div id="profile-content" class="mt-2">
						<div class="d-flex flex-row ms-4">
							<div class="d-flex flex-column align-items-start mt-2 ms-3 me-5 mt-5">
								<div id="avatar">
									${
										this._userInfo.avatar
											? `<img
													id="nav-bar-avatar"
													class="white-border-lg"
													src="${this._userInfo.avatar}"
													alt="avatar"
													width="150"
													height="150"
													style="border-radius: 50%"
												/>`
											: `<base-avatar-box size="150"></base-avatar-box>`
									}
								</div>
							</div>
							<div class="d-flex flex-column align-items-start mt-2">
								<div id="username" class="mb-2">
									<h1 style="font-size: 50px; color: white; border-bottom: 2px solid #ffd700;">
										${this._userInfo.username}
									</h1>
								</div>
								<div id="date-joined">
									<h1 style="font-size: 18px">
										<span style="color: #ffd700;">Date joined:</span> 
										<span style="color: white;">${this._userInfo.date_joined}</span>
									</h1>
								</div>
								<div id="matches-played">
									<h1 style="font-size: 18px">
										<span style="color: #ffd700;">Matches played:</span> 
										<span style="color: white;"> ${this._matchHistory ? this._matchHistory.length : 0}</span>
									</h1>
								</div>
								<div id="player-record">
									<h1 style="font-size: 18px">
										<span style="color: #ffd700;">Record:</span> 
										<span style="color: white;"> ${this._winRecord}W-${this._lossRecord}L</span>
									</h1>
								</div>
								<div id="player-record">
									<h1 style="font-size: 18px">
										<span style="color: #ffd700;">Win rate:</span> 
										<span style="color: white;"> ${!this._matchHistory.length ? 0 : this._winRecord / this._matchHistory.length * 100}%</span>
									</h1>
								</div>
								<div id="online-status" class="d-flex flex-row">
									<span class="${isOnline ? "online-lg mt-1" : "offline-lg mt-1"}"></span>
									<h3 class="ms-2 mt-1" style="font-size: 18px; font-weight: bold">${isOnline ? "online" : "offline"}</h3>
								</div>
							</div>
						</div>
						<div class="d-flex flex-column align-items-center mt-2">
							<div id="match-history">
								${await this.loadMatchHistory()}
							</div>
						</div
					<div>
				</div>
			</div>
		`;
	}

	async loadDOMChanges() {
		const parentNode = document.getElementById("profile-page");
		parentNode.innerHTML = await this.loadProfilePage();
	}

    async getHtml() {
		return `
			<div class="container" id="profile-page">
				<div class="center">
					<loading-icon size="5rem"></loading-icon>
				</div>
			</div>
		`;
	}
}
