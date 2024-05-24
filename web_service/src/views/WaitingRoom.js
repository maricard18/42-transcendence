import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import { navigateTo } from "..";
import { transitDecrypt } from "../functions/vaultAccess";
import { closeWebsocket, connectGameWebsocket, GameWebsocket, sendMessage } from "../functions/websocket";

export default class WaitingRoom extends AbstractView {
    constructor() {
        super();
        AbstractView.cleanGameData();
        this._location = location.pathname;
        this._lobbySize = this._location.substring(this._location.length - 1);
        this._parentNode = null;
        this._loading = true;
        this._creatingConnection = false;
        this._callback = false;
        this._gameWsCreatedRender = false;
        this._lobbyFull = false;

		const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    defineCallback = async () => {
        const parentNode = document.getElementById("waiting-room");
        if (parentNode) {
            this._parentNode = parentNode;
            if (!this._callback) {
                this._callback = true;
                this._parentNode.addEventListener(
                    "waiting-room-callback",
                    this.waitingRoomCallback
                );
            }
        } else {
            return;
        }

        this.startConnectingProcess = async () => {
            AbstractView.wsConnectionStarted = true;
            try {
                await connectGameWebsocket();
                AbstractView.previousLocation = this._location;
            } catch (error) {

			}
            this._loading = false;
            this.loadDOMChanges();
        };

        if (!AbstractView.gameWsCreated && !AbstractView.wsConnectionStarted) {
            await this.startConnectingProcess();
        }
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        this._parentNode.removeEventListener(
            "waiting-room-callback",
            this.waitingRoomCallback
        );

        this._callback = false;
        this._observer.disconnect();
    }

    waitingRoomCallback = () => {
        if (AbstractView.gameWsCreated && !this._gameWsCreatedRender) {
            this._gameWsCreatedRender = true;
            this.loadDOMChanges();
        }

        if (!this._lobbyFull &&
            Object.keys(AbstractView.userQueue).length == this._lobbySize) {
            this._lobbyFull = true;
            this.loadDOMChanges();
        } else if (this._lobbyFull &&
            Object.keys(AbstractView.userQueue).length != this._lobbySize) {
            this._loading = true;
            this._lobbyFull = false;
            AbstractView.userData = {};
            closeWebsocket();
            this.startConnectingProcess();
        }

        if (Object.keys(AbstractView.userQueue).length == this._lobbySize &&
            Object.keys(AbstractView.userReadyList).length == this._lobbySize) {
            const allUsersReady = Object.values(AbstractView.userReadyList).every((ready) => ready);

            if (allUsersReady) {
                localStorage.setItem("game_status", "loading");
                localStorage.setItem("previous_location", location.pathname);
                AbstractView.gameOver = false;
				this.removeCallbacks();

				if (this._game === "pong") {
					navigateTo("/home/pong/play/multiplayer/" + this._lobbySize);
				} else {
					navigateTo("/home/tic-tac-toe/play/multiplayer/" + this._lobbySize);
				}
            }
        }
    }

    async loadDOMChanges() {
		const parentNode = document.getElementById("waiting-room");
        if (parentNode) {
            parentNode.innerHTML = this.loadWaitingRoomContent();
        }
    }

    loadWaitingRoomContent() {
        return `
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="d-flex flex-row justify-content-center mb-4">
					<h3>Waiting for players</h3>
					<loading-icon size="1rem"></loading-icon>
				</div>
				${(new PlayerQueue()).getHtml()}
				${(this._lobbyFull ? (new ReadyButton()).getHtml() : (new ReadyButton()).getHtml(true))}
			</div>
		`;
    }

    getHtml() {
        if (this._loading) {
            return `
				<div class="d-flex flex-column col-md-6" id="waiting-room">
					<div id="loading">
						<loading-icon template="center" size="5rem"></loading-icon>
					</div>
				</div>
			`;
        }
        return this.loadWaitingRoomContent();
    }
}

class PlayerQueue extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._location = location.pathname;
        this._lobbySize = this._location.substring(this._location.length - 1);
        this._parentNode = null;
        this._loading = true;
        this._callback = false;

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    defineCallback = async () => {
        const parentNode = document.getElementById("player-queue");
        if (parentNode) {
            this._parentNode = parentNode;
            if (!this._callback) {
                this._callback = true;
                this._parentNode.addEventListener(
                    "player-queue-callback",
                    this.playerQueueCallback.bind(this)
                );
                this._parentNode.addEventListener(
                    "player-queue-refresh",
                    this.loadDOMChanges.bind(this)
                );
            }
        }
    }

    removeCallbacks = () => {
		this._observer.disconnect();

        this._parentNode.removeEventListener(
            "player-queue-callback",
            this.playerQueueCallback
        );
        this._parentNode.removeEventListener(
            "player-queue-refresh",
            this.loadDOMChanges
        );
    }

    playerQueueCallback() {
        const fetchUserData = async () => {
            const data = await Promise.all(
                Object.values(AbstractView.userQueue).map((value) =>
                    value === AbstractView.userInfo.id
                        ? AbstractView.userInfo
                        : getUserData(value)
                )
            );
            AbstractView.userData = data;
            this._loading = false;
            this.loadDOMChanges();
        };

        if (Object.values(AbstractView.userData).length != this._lobbySize) {
            fetchUserData();
        } else {
            this._loading = false;
            this.loadDOMChanges();
        }
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("player-queue");
        if (parentNode) {
            parentNode.innerHTML = this.loadPlayerQueue();
        }
    }

    loadPlayerQueue() {
        return `
			<div class="justify-content-start align-items-start mb-3" id="player-queue">
				${!this._loading && AbstractView.userData
					? AbstractView.userData.map((data, index) =>
						data
							? data.avatar
								? (`<div class="d-flex flex-row justify-content-center align-items-center mb-2">
										<img
											src=${data.avatar}
											alt="Avatar preview"
											width="40"
											height="40"
											class="white-border-sm"
											style="border-radius: 50%"
										/>
										<div class="username-text ms-3 mt-2">
											<h5>${data.username}</h5>
										</div>
										<div class="ms-2">
											${Object.keys(AbstractView.userQueue).length == this._lobbySize
												? (AbstractView.userReadyList[data.id]
													? `<check-icon></check-icon>`
													: `<close-icon></close-icon>`)
												: ``
											}
										</div>
									</div>`)
								: (`<div class="d-flex flex-row justify-content-center align-items-center mb-2">
										<base-avatar-box size="40px"></base-avatar-box>
										<div class="username-text ms-3 mt-2">
											<h5>${data.username}</h5>
										</div>
										<div class="ms-2">
											${Object.keys(AbstractView.userQueue).length == this._lobbySize
												? (AbstractView.userReadyList[data.id]
													? `<check-icon></check-icon>`
													: `<close-icon></close-icon>`)
												: ``
											}
										</div>
									</div>`)
							: ``)
					: `<loading-icon size="3rem"></loading-icon>`
				}
			</div>
		`;
    }

    getHtml() {
        return this.loadPlayerQueue();
    }
}

class ReadyButton extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._parentNode = null;
        this._callback = false;
        this._clickCallback = false;
        this._readyState = false;

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    defineCallback = async () => {
        const parentNode = document.getElementById("ready-button");
        if (parentNode) {
            this._parentNode = parentNode;
            if (!this._callback) {
                this._callback = true;
                AbstractView.userReadyList = {
                    ...AbstractView.userReadyList,
                    [AbstractView.userInfo.id]: false,
                }

                const message = {
                    state: {
                        [AbstractView.userInfo.id]: this._readyState,
                    },
                };
                
				sendMessage(GameWebsocket.ws, message);
            }
        } else {
            return;
        }

        this.buttonClickedCallback = () => {
            if (!this._readyState) {
                AbstractView.userReadyList = {
                    ...AbstractView.userReadyList,
                    [AbstractView.userInfo.id]: true
                }
                this._readyState = true;
            } else {
                AbstractView.userReadyList = {
                    ...AbstractView.userReadyList,
                    [AbstractView.userInfo.id]: false
                }
                this._readyState = false;
            }

            const message = {
                state: {
                    [AbstractView.userInfo.id]: this._readyState,
                },
            };

            sendMessage(GameWebsocket.ws, message);
            
			const waitingRoomNode = document.getElementById("waiting-room");
			if (waitingRoomNode) {
				waitingRoomNode.dispatchEvent(new CustomEvent("waiting-room-callback"));
			}

            const playerQueueNode = document.getElementById("player-queue");
            if (playerQueueNode) {
				playerQueueNode.dispatchEvent(new CustomEvent("player-queue-refresh"));
			}
            
			this.loadDOMChanges();
        };

        const button = this._parentNode.querySelector("button");
        if (button && !this._clickCallback) {
            this._clickCallback = true;
            button.addEventListener(
                "click",
                this.buttonClickedCallback
            );
        }
    }

    removeCallbacks = () => {
		this._observer.disconnect();

		if (!this._parentNode) {
            return;
        }

        const button = this._parentNode.querySelector("button");
        if (button) {
            button.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("ready-button");
		if (parentNode) {
			parentNode.innerHTML = this.loadReadyButton();
			this._clickCallback = false;
		}
    }

    loadReadyButton(disabled = false) {
        let template;
        if (this._readyState) {
            template = "secondary-button extra-btn-class";
        } else {
            template = "primary-button extra-btn-class";
        }

        return `
			<div class="mt-4" id="ready-button">
				<button
					type="button"
					class="btn btn-primary ${template}"
					${disabled ? 'disabled' : ''}
				>
					${!this._readyState ? "Ready" : "Not ready"}
				</button>
			</div>
		`;
    }

    getHtml(disabled = false) {
        return this.loadReadyButton(disabled);
    }
}

async function getUserData(value) {
    let jsonData;
	let data = {
        username: "loading",
        email: "loading",
        id: value,
    };

    const headers = {
        Authorization: `Bearer ${await getToken()}`,
    };

    const response = await fetchData("/api/users/" + value, "GET", headers);

    if (response && !response.ok) {
        return data;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        return data;
    }

    data = {
        username: await transitDecrypt(jsonData["username"]),
        email: await transitDecrypt(jsonData["email"]),
        id: value,
    };

    if (jsonData["avatar"]) {
        data["avatar"] = jsonData["avatar"]["link"];
    }

    return data;
}
