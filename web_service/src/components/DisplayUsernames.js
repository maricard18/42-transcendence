import AbstractView from "../views/AbstractView";
import { findTournamentMatch } from "../views/Tournament";

export class Display2Usernames extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._callback = false;
        this._player1 = false;
        this._player2 = false;
        this._player3 = false;
        this._player4 = false;
        this._location = location.pathname;
        this._gameMode = this._location.match(/\/([^\/]+)\/[^\/]+$/)[1];
        this._lobbySize = this._location.substring(this._location.length - 1);
        AbstractView.previousLocation = this._location;
    }

    loadUsernames() {
        if (this._gameMode === "single-player" && this._lobbySize == 1) {
            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					${
						AbstractView.userInfo.avatar
							? `<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
										<img
											src=${AbstractView.userInfo.avatar}
											alt="Avatar preview"
											width="50"
											height="50"
											class="red-border-sm"
											style="border-radius: 50%"
										/>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userInfo.username}</h3>
										</div>
										<div class="username-text ms-4 mt-1">
											<h1 id="player1">0</h1>
										</div>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center ms-5" id="player1-info">
										<base-avatar-box 
											size="50px"
											template="red-border-sm"
										></base-avatar-box>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userInfo.username}</h3>
										</div>
										<div class="username-text ms-4 mt-1">
											<h1 id="player1">0</h1>
										</div>
									</div>`
					}
					<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
						<div class="username-text me-4 mt-1">
							<h1 id="player2">0</h1>
						</div>
						<div class="username-text me-3 mt-2">
							<h3>${localStorage.getItem("player2")}</h3>
						</div>
						<img
							src="/static/images/cpu.png"
							alt="Avatar preview"
							width="50"
							height="50"
							class="blue-border-sm"
							style="border-radius: 50%"
						/>
					</div>
				</div>
        	`;
        } else if (this._gameMode === "single-player" && this._lobbySize == 2) {
            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
						<img
							src="/static/images/michael-scott.png"
							alt="Avatar preview"
							width="50"
							height="50"
							class="red-border-sm"
							style="border-radius: 50%"
						/>
						<div class="username-text ms-3 mt-2">
							<h3>${localStorage.getItem("player1")}</h3>
						</div>
						<div class="username-text ms-4 mt-1">
							<h1 id="player1">0</h1>
						</div>
					</div>
					${
						AbstractView.userInfo.avatar
							? `<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
										<div class="username-text me-4 mt-1">
											<h1 id="player2">0</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userInfo.username}</h3>
										</div>
										<img
											src=${AbstractView.userInfo.avatar}
											alt="Avatar preview"
											width="50"
											height="50"
											class="blue-border-sm"
											style="border-radius: 50%"
										/>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center me-5" id="player2-info">
										<div class="username-text me-4 mt-1">
											<h1 id="player2">0</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userInfo.username}</h3>
										</div>
										<base-avatar-box 
											size="50px"
											template="blue-border-sm"
										></base-avatar-box>
									</div>`
					}
				</div>
        	`;
        } else if (this._gameMode === "multiplayer" && this._lobbySize == 2) {
            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					${
						AbstractView.userData[0].avatar
							? `<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
										<img
											src=${AbstractView.userData[0].avatar}
											alt="Avatar preview"
											width="50"
											height="50"
											class="red-border-sm"
											style="border-radius: 50%"
										/>
										<div class="username-text justify-content-center align-content-center ms-3 mt-2">
											<h3>${AbstractView.userData[0].username}</h3>
										</div>
										<div class="username-text ms-4 mt-1">
											<h1 id="player1">0</h1>
										</div>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
										<base-avatar-box 
											size="50px"
											template="red-border-sm"
										></base-avatar-box>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userData[0].username}</h3>
										</div>
										<div class="username-text ms-4 mt-1">
											<h1 id="player1">0</h1>
										</div>
									</div>`
					}
					${
						AbstractView.userData[1].avatar
							? `<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
										<div class="username-text me-4 mt-1">
											<h1 id="player2">0</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userData[1].username}</h3>
										</div>
										<img
											src=${AbstractView.userData[1].avatar}
											alt="Avatar preview"
											width="50"
											height="50"
											class="blue-border-sm"
											style="border-radius: 50%"
										/>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
										<div class="username-text me-4 mt-1">
											<h1 id="player2">0</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userData[1].username}</h3>
										</div>
										<base-avatar-box 
											size="50px"
											template="blue-border-sm"
										></base-avatar-box>
									</div>`
					}
				</div>
        	`;
        } else if (this._gameMode === "tournament" && this._lobbySize == 2) {
			const match = findTournamentMatch();
			console.log("match:", match);

            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
						<img
							src=${match["player1"]["avatar"]}
							alt="Avatar preview"
							width="50"
							height="50"
							class="red-border-sm"
							style="border-radius: 50%"
						/>
						<div class="username-text justify-content-center align-content-center ms-3 mt-2">
							<h3>${match["player1"]["username"]}</h3>
						</div>
						<div class="username-text ms-4 mt-1">
							<h1 id="player1">0</h1>
						</div>
					</div>
					<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
						<div class="username-text me-4 mt-1">
							<h1 id="player2">0</h1>
						</div>
						<div class="username-text me-3 mt-2">
							<h3>${match["player2"]["username"]}</h3>
							</div>
						<img
							src=${match["player2"]["avatar"]}
							alt="Avatar preview"
							width="50"
							height="50"
							class="blue-border-sm"
							style="border-radius: 50%"
						/>
					</div>
				</div>
        	`;
        }
    }

    getHtml() {
        return this.loadUsernames();
    }
}

export class DisplayUsername extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._parentNode = null;
        this._callback = false;
        this._player1 = false;
        this._player2 = false;
        this._player3 = false;
        this._player4 = false;
        this._location = location.pathname;
        this._gameMode = this._location.match(/\/([^\/]+)\/[^\/]+$/)[1];
        this._lobbySize = this._location.substring(this._location.length - 1);
        AbstractView.previousLocation = this._location;
    }

    loadPlayer1() {
        return `
			<div class="d-flex flex-column justify-content-center align-items-center" id="display-username" style="transform: rotate(-90deg); width: 100px">
			${
				AbstractView.userData[0].avatar
					? `<div class="d-flex align-content-center ms-5 mb-2" id="player1-info">
							<img
								src=${AbstractView.userData[0].avatar}
								alt="Avatar preview"
								width="50"
								height="50"
								class="red-border-sm"
								style="border-radius: 50%"
							/>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[0].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player1">0</h1>
							</div>
						</div>`
					: `<div class="d-flex align-content-center ms-5" id="player1-info">
							<base-avatar-box 
								size="50px"
								template="red-border-sm"
							></base-avatar-box>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[0].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player1">0</h1>
							</div>
						</div>`
			}
			</div>
		`;
    }

    loadPlayer2() {
        return `
			<div class="d-flex flex-column justify-content-center align-items-center" id="display-username" style="transform: rotate(90deg); width: 100px">
			${
				AbstractView.userData[1].avatar
					? `<div class="d-flex align-content-center ms-5 mb-2" id="player2-info">
						<img
							src=${AbstractView.userData[1].avatar}
							alt="Avatar preview"
							width="50"
							height="50"
							class="blue-border-sm"
							style="border-radius: 50%"
						/>
						<div class="username-text ms-3 mt-2">
							<h3>${AbstractView.userData[1].username}</h3>
						</div>
						<div class="username-text ms-4 mt-1">
							<h1 id="player2">0</h1>
						</div>
					</div>`
					: `<div class="d-flex align-content-center ms-5" id="player2-info">
						<base-avatar-box 
							size="50px"
							template="blue-border-sm"
						></base-avatar-box>
						<div class="username-text ms-3 mt-2">
							<h3>${AbstractView.userData[1].username}</h3>
						</div>
						<div class="username-text ms-4 mt-1">
							<h1 id="player2">0</h1>
						</div>
					</div>`
			}
			</div>
		`;
    }

    loadPlayer3() {
        return `
			<div class="d-flex flex-row justify-content-center" id="display-username">
			${
				AbstractView.userData[2].avatar
					? `<div class="d-flex me-5" id="player3-info">
							<img
								src=${AbstractView.userData[2].avatar}
								alt="Avatar preview"
								width="50"
								height="50"
								class="green-border-sm"
								style="border-radius: 50%"
							/>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[2].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player3">0</h1>
							</div>
						</div>`
					: `<div class="d-flex me-5" id="player3-info">
							<base-avatar-box 
								size="50px"
								template="green-border-sm"
							></base-avatar-box>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[2].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player3">0</h1>
							</div>
						</div>`
			}
			</div>
		`;
    }

    loadPlayer4() {
        return `
			<div class="d-flex flex-row justify-content-center mt-3 me-5" id="display-username">
			${
				AbstractView.userData[3].avatar
					? `<div class="d-flex ms-5 mb-2" id="player4-info">
							<img
								src=${AbstractView.userData[3].avatar}
								alt="Avatar preview"
								width="50"
								height="50"
								class="yellow-border-sm"
								style="border-radius: 50%"
							/>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[3].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player4">0</h1>
							</div>
						</div>`
					: `<div class="d-flex ms-5 mb-2" id="player4-info">
							<base-avatar-box 
								size="50px"
								template="yellow-border-sm"
							></base-avatar-box>
							<div class="username-text ms-3 mt-2">
								<h3>${AbstractView.userData[3].username}</h3>
							</div>
							<div class="username-text ms-4 mt-1">
								<h1 id="player4">0</h1>
							</div>
						</div>`
			}
			</div>
		`;
    }

    getHtml(player) {
        if (player === "player1") {
            return this.loadPlayer1();
        } else if (player === "player2") {
            return this.loadPlayer2();
        } else if (player === "player3") {
            return this.loadPlayer3();
        } else {
            return this.loadPlayer4();
        }
    }
}
