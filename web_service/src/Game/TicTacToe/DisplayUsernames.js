import AbstractView from "../../views/AbstractView";
import {findTournamentMatch} from "../../views/Tournament";

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
        if (this._gameMode === "single-player") {
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
											class="white-border-sm"
											style="border-radius: 50%"
										/>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userInfo.username}</h3>
										</div>
										<div class="username-text ms-4">
											<h1 id="player1" style="font-size: 50px; color: #6511ed">X</h1>
										</div>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center ms-5" id="player1-info">
										<base-avatar-box 
											size="50px"
											template="white-border-sm"
										></base-avatar-box>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userInfo.username ? AbstractView.userInfo.username : "loading ..."}</h3>
										</div>
										<div class="username-text ms-4">
											<h1 id="player1" style="font-size: 50px; color: #6511ed">X</h1>
										</div>
									</div>`
					}
					<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
						<div class="username-text me-4">
							<h1 id="player2" style="font-size: 50px; color: #9461e6">O</h1>
						</div>
						<div class="username-text me-3 mt-2">
							<h3>${localStorage.getItem("player2")}</h3>
						</div>
						<img
							src="${this._lobbySize === 1 ? "/static/images/cpu.png" : "/static/images/michael-scott.png"}"
							alt="Avatar preview"
							width="50"
							height="50"
							class="white-border-sm"
							style="border-radius: 50%"
						/>
					</div>
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
											class="white-border-sm"
											style="border-radius: 50%"
										/>
										<div class="username-text justify-content-center align-content-center ms-3 mt-2">
											<h3>${AbstractView.userData[0].username}</h3>
										</div>
										<div class="username-text ms-4">
											<h1 id="player1" style="font-size: 50px; color: #6511ed">X</h1>
										</div>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
										<base-avatar-box 
											size="50px"
											template="white-border-sm"
										></base-avatar-box>
										<div class="username-text ms-3 mt-2">
											<h3>${AbstractView.userData[0].username ? AbstractView.userData[0].username : "loading ..."}</h3>
										</div>
										<div class="username-text ms-4">
											<h1 id="player1" style="font-size: 50px; color: #6511ed">X</h1>
										</div>
									</div>`
					}
					${
						AbstractView.userData[1].avatar
							? `<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
										<div class="username-text me-4">
											<h1 id="player2" style="font-size: 50px; color: #9461e6">O</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userData[1].username}</h3>
										</div>
										<img
											src=${AbstractView.userData[1].avatar}
											alt="Avatar preview"
											width="50"
											height="50"
											class="white-border-sm"
											style="border-radius: 50%"
										/>
									</div>`
							: `<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
										<div class="username-text me-4">
											<h1 id="player2" style="font-size: 50px; color: #9461e6">O</h1>
										</div>
										<div class="username-text me-3 mt-2">
											<h3>${AbstractView.userData[1].username ? AbstractView.userData[1].username : "loading ..."}</h3>
										</div>
										<base-avatar-box 
											size="50px"
											template="white-border-sm"
										></base-avatar-box>
									</div>`
					}
				</div>
        	`;
        } else if (this._gameMode === "tournament" && this._lobbySize == 2) {
			const match = findTournamentMatch();
			console.debug("match:", match);

            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					<div class="d-flex justify-content-center align-content-center ms-5 mb-2" id="player1-info">
						<img
							src=${match["player1"]["avatar"]}
							alt="Avatar preview"
							width="50"
							height="50"
							class="white-border-sm"
							style="border-radius: 50%"
						/>
						<div class="username-text justify-content-center align-content-center ms-3 mt-2">
							<h3>${match["player1"]["username"]}</h3>
						</div>
						<div class="username-text ms-4">
							<h1 id="player1" style="font-size: 50px; color: #6511ed">X</h1>
						</div>
					</div>
					<div class="d-flex justify-content-center align-content-center me-5 mb-2" id="player2-info">
						<div class="username-text me-4">
							<h1 id="player2" style="font-size: 50px; color: #9461e6">O</h1>
						</div>
						<div class="username-text me-3 mt-2">
							<h3>${match["player2"]["username"]}</h3>
							</div>
						<img
							src=${match["player2"]["avatar"]}
							alt="Avatar preview"
							width="50"
							height="50"
							class="white-border-sm"
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
