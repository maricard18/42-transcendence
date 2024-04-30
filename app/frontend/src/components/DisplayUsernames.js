import AbstractView from "../views/AbstractView";

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
        this.player1Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player2Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player3Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player4Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        const player1 = document.getElementById("player1");
        if (player1 && !this._player1) {
            this._player1 = true;
            player1.addEventListener("player1", this.player1Callback);
        }
        const player2 = document.getElementById("player2");
        if (player2 && !this._player2) {
            this._player2 = true;
            player2.addEventListener("player2", this.player2Callback);
        }
    }

    loadUsernames() {
        if (this._gameMode === "single-player" && this._lobbySize == 1) {
            return `
				<div class="d-flex flex-row justify-content-between" id="display-usernames">
					${
                        AbstractView.userInfo.avatar
                            ? `<div class="d-flex justify-content-center align-content-center ms-5 mb-2">
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
								<div class="username-text ms-5 mt-2">
									<h1 id="player1">0</h1>
								</div>
							</div>`
                            : `<div class="d-flex justify-content-center align-content-center ms-5">
								<base-avatar-box 
									size="50px"
									template="red-border-sm"
								></base-avatar-box>
								<div class="username-text ms-3 mt-2">
									<h3>${AbstractView.userInfo.username}</h3>
								</div>
								<div class="username-text ms-5 mt-2">
									<h1 id="player1">0</h1>
								</div>
							</div>`
                    }
					<div class="d-flex justify-content-center align-content-center me-5 mb-2">
						<div class="username-text me-5 mt-2">
							<h1 id="player2">0</h1>
						</div>
						<div class="username-text me-3 mt-2">
							<h3>CPU</h3>
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
					<div class="d-flex justify-content-center align-content-center ms-5 mb-2">
						<img
							src="/static/images/michael-scott.png"
							alt="Avatar preview"
							width="50"
							height="50"
							class="red-border-sm"
							style="border-radius: 50%"
						/>
						<div class="username-text ms-3 mt-2">
							<h3>opponent</h3>
						</div>
						<div class="username-text ms-5 mt-2">
							<h1 id="player1">0</h1>
						</div>
					</div>
					${
                        AbstractView.userInfo.avatar
                            ? `<div class="d-flex justify-content-center align-content-center me-5 mb-2">
								<div class="username-text me-5 mt-2">
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
                            : `<div class="d-flex justify-content-center align-content-center me-5">
								<div class="username-text me-5 mt-2">
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
                            ? `<div class="d-flex justify-content-center align-content-center ms-5 mb-2">
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
								<div class="username-text ms-5 mt-2">
									<h1 id="player1">0</h1>
								</div>
							</div>`
                            : `<div class="d-flex justify-content-center align-content-center ms-5 mb-2">
								<base-avatar-box 
									size="50px"
									template="red-border-sm"
								></base-avatar-box>
								<div class="username-text ms-3 mt-2">
									<h3>${AbstractView.userData[0].username}</h3>
								</div>
								<div class="username-text ms-5 mt-2">
									<h1 id="player1">0</h1>
								</div>
							</div>`
                    }
					${
                        AbstractView.userData[1].avatar
                            ? `<div class="d-flex justify-content-center align-content-center me-5 mb-2">
								<div class="username-text me-5 mt-2">
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
                            : `<div class="d-flex justify-content-center align-content-center me-5 mb-2">
								<div class="username-text me-5 mt-2">
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
        this.player1Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player2Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player3Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        this.player4Callback = (event) => {
            event.target.innerHTML = event.detail;
        };

        const player1 = document.getElementById("player1");
        if (player1 && !this._player1) {
            this._player1 = true;
            player1.addEventListener("player1", this.player1Callback);
        }
        const player2 = document.getElementById("player2");
        if (player2 && !this._player2) {
            this._player2 = true;
            player2.addEventListener("player2", this.player2Callback);
        }
        const player3 = document.getElementById("player3");
        if (player3 && !this._player3) {
            this._player3 = true;
            player3.addEventListener("player3", this.player3Callback);
        }
        const player4 = document.getElementById("player4");
        if (player4 && !this._player4) {
            this._player4 = true;
            player4.addEventListener("player4", this.player4Callback);
        }
    }

    loadPlayer1() {
        return `
			<div class="d-flex flex-column justify-content-center" id="display-username" style="transform: rotate(-90deg)">
			${
                AbstractView.userData[0].avatar
                    ? `<div class="d-flex align-content-center ms-5 mb-2">
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
						<div class="username-text ms-5 mt-2">
							<h1 id="player1">0</h1>
						</div>
					</div>`
                    : `<div class="d-flex align-content-center ms-5">
						<base-avatar-box 
							size="50px"
							template="red-border-sm"
						></base-avatar-box>
						<div class="username-text ms-3 mt-2">
							<h3>${AbstractView.userData[0].username}</h3>
						</div>
						<div class="username-text ms-5 mt-2">
							<h1 id="player1">0</h1>
						</div>
					</div>`
            }
			</div>
		`;
    }

    loadPlayer2() {
        return `
		<div class="d-flex flex-column justify-content-center" id="display-username" style="transform: rotate(90deg)">
		${
            AbstractView.userData[1].avatar
                ? `<div class="d-flex align-content-center ms-5 mb-2">
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
					<div class="username-text ms-5 mt-2">
						<h1 id="player2">0</h1>
					</div>
				</div>`
                : `<div class="d-flex align-content-center ms-5">
					<base-avatar-box 
						size="50px"
						template="blue-border-sm"
					></base-avatar-box>
					<div class="username-text ms-3 mt-2">
						<h3>${AbstractView.userData[1].username}</h3>
					</div>
					<div class="username-text ms-5 mt-2">
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
                    ? `<div class="d-flex align-content-center ms-5 mb-2">
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
						<div class="username-text ms-5 mt-2">
							<h1 id="player3">0</h1>
						</div>
					</div>`
                    : `<div class="d-flex align-content-center ms-5 mb-2">
						<base-avatar-box 
							size="50px"
							template="green-border-sm"
						></base-avatar-box>
						<div class="username-text ms-3 mt-2">
							<h3>${AbstractView.userData[2].username}</h3>
						</div>
						<div class="username-text ms-5 mt-2">
							<h1 id="player3">0</h1>
						</div>
					</div>`
            }
			</div>
		`;
    }

    loadPlayer4() {
        return `
		<div class="d-flex flex-row justify-content-center mt-4" id="display-username">
			${
                AbstractView.userData[3].avatar
                    ? `<div class="d-flex align-content-center ms-5 mb-2">
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
						<div class="username-text ms-5 mt-2">
							<h1 id="player4">0</h1>
						</div>
					</div>`
                    : `<div class="d-flex align-content-center ms-5 mb-2">
						<base-avatar-box 
							size="50px"
							template="yellow-border-sm"
						></base-avatar-box>
						<div class="username-text ms-3 mt-2">
							<h3>${AbstractView.userData[3].username}</h3>
						</div>
						<div class="username-text ms-5 mt-2">
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
