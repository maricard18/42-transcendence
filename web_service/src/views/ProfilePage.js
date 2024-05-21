import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import { getToken } from "../functions/tokens";
import { navigateTo } from "..";
import { getFriendship } from "./FriendsPage";
import { StatusWebsocket, sendMessage } from "../functions/websocket";

export default class ProfilePage extends AbstractView {
    constructor() {
        super();
		const index = location.pathname.lastIndexOf("/");
		this._userId = location.pathname.substring(index + 1);
		this._friendship = null;
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

	addEventListners() {
		const addFriendIcon = document.getElementById(`add-friend-${this._userId}`);
		if (addFriendIcon) {
			addFriendIcon.addEventListener("click", () => { this.addFriend(this._userId) });
		}

		const removeFriendIcon = document.getElementById(`remove-friend-${this._friendship ? this._friendship.id : ""}`);
		if (removeFriendIcon) {
			removeFriendIcon.addEventListener("click", () => { this.removeFriend(this._friendship.id) });
		}

		for (let [index, match] of this._matchHistory.entries()) {
			const gameLog = document.getElementById(`game-log-${index}`);
			if (gameLog) {
				for (let id of Object.values(match.players)) {
					const avataraAndUsernameDiv = gameLog.querySelector(`#player-id-${id}`);
					if (avataraAndUsernameDiv) {
						avataraAndUsernameDiv.addEventListener("click", async () => await navigateTo(`/home/profile/${id}`));
					}
				}
			}
		}
	}

	async addFriend(id) {
		const formDataToSend = new FormData();
		formDataToSend.append("user_id", AbstractView.userInfo.id);
		formDataToSend.append("friend_id", id);

		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			"/api/friendships",
			"POST",
			headers,
			formDataToSend
		);

		if (response.ok) {
			const data = await response.json();
			await getFriendship(data.id);

			const message = {
				message: "friendship.created",
				friend_id: id
			};
			sendMessage(StatusWebsocket.ws, message);
			
			this.loadDOMChanges();
		} else {
			console.error("Error: failed to send friend request ", response.status);
		}
	}

	async removeFriend(id) {
		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			`/api/friendships/${id}`,
			"DELETE",
			headers,
			null
		);

		if (response.ok) {
			let friend_id;
			for (let [index, friendship] of AbstractView.friendships.entries()) {
				if (id === friendship.id) {
					friend_id = friendship.friend_id;
					AbstractView.friendships.splice(index, 1);
					break ;
				}
			}

			const message = {
				message: "friendship.destroyed",
				friend_id: friend_id
			};
			sendMessage(StatusWebsocket.ws, message);

			this.loadDOMChanges();
		} else {
			console.error("Error: failed to delete friend ", response.status);
		}
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
		div.style.maxHeight = "340px";
		div.style.overflowY = "auto";
		
		const reversedMatchHistory = this._matchHistory.reverse();
		for (let [index, match] of reversedMatchHistory.entries()) {
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
			playersDiv.setAttribute("class", "d-flex flex-column align-items-start w-100 ms-3 mt-4");
			playersDiv.id= `game-log-${index}`;

			for (let [index, player] of playersInfo.entries()) {
				const avataraAndUsernameDiv = document.createElement("div");
				avataraAndUsernameDiv.setAttribute("class", `d-flex flex-row align-items-center pointer mt-1 mb-3`);
				avataraAndUsernameDiv.id = `player-id-${player.id}`;
				
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
				scoreDiv.setAttribute("class", "d-flex flex-row align-items-center justify-content-center");
				scoreDiv.style.height = "60px";
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
		this.getPlayerRecord();		
		let winPercentage = this._winRecord / this._matchHistory.length * 100;

		if (!winPercentage) {
			winPercentage = 0;
		}

		if (AbstractView.friendships) {
			for (let friendship of AbstractView.friendships.values()) {
				if (friendship.friend_id == this._userId) {
					this._friendship = friendship;
					break ;
				}
			}
		}
		
		return `
			<div class="center">
				<div class="d-flex flex-column justify-content-start profile-box">
					<div id="profile-content" class="mt-2">
						<div class="d-flex flex-row ms-4 mb-3">
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
							<div class="d-flex flex-column align-items-start w-100 mt-2">
								<div id="username" class="d-flex flex-row w-100 mb-2">
									<h1 style="font-size: 50px; color: white; border-bottom: 2px solid #ffd700;">
										${this._userInfo.username}
									</h1>
									${
										this._userId != AbstractView.userInfo.id
											? !this._friendship
												?	`<div class="d-flex justify-content-end w-100 me-5 mt-3 pointer" id="add-friend-${this._userId}">
														<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
															<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
															<path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
														</svg>
													</div>`
												:	`<div class="d-flex justify-content-end w-100 me-5 mt-3 pointer" id="remove-friend-${this._friendship.id}">
														<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
															<path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"/>
															<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
														</svg>
													</div>`
											:	``
									}
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
										<span style="color: white;"> ${Math.trunc(winPercentage)}%</span>
									</h1>
								</div>
								${
									this._friendship
										?	`<div id="online-status-info-${this._userId}" class="d-flex flex-row">
												<span class="${this._friendship.online ? "online-lg mt-1" : "offline-lg mt-1"}"></span>
												<h3 
													class="ms-2" 
													style="font-size: 18px; font-weight: bold">${this._friendship.online ? "online" : "offline"}
												</h3>
											</div>`
										: 	``
								}
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
		this._winRecord = 0;
		this._lossRecord = 0;
		this._friendship = null;
		const parentNode = document.getElementById("profile-page");
		parentNode.innerHTML = await this.loadProfilePage();
		this.addEventListners();
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
