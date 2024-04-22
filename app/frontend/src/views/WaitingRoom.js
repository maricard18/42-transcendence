import AbstractView from "./AbstractView";
import {
    MyWebSocket,
    closeWebsocket,
    connectWebsocket,
} from "../functions/websocket";
import { navigateTo } from "..";

export default class WaitingRoom extends AbstractView {
    constructor() {
        super();
        this._location = location.pathname;
        this._lobbySize = this._location.substring(this._location.length - 1);
        this._parentNode = null;
        this._loading = true;
		this._creatingConnection = false;
        this._callback = false;
        this._lobbyFull = false;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
        };
    }

    async defineCallback() {
        const parentNode = document.getElementById("waiting-room");
        if (parentNode) {
            this._parentNode = parentNode;
			if (!this._callback) {
				this._callback = true;
				this._parentNode.addEventListener(
					"waiting-room-callback", 
					this.waitingRoomVerifications.bind(this)
				);
			}
        } else {
            return;
        }

        this.startConnectingProcess = async () => {
			AbstractView.wsConnectionStarted = true;
			try {
				await connectWebsocket(this._lobbySize);
			} catch(error) {
				console.log(error);
			}
			this._loading = false;
			this.loadDOMChanges();
		};
	
		if (!AbstractView.wsCreated && !AbstractView.wsConnectionStarted) {
			await this.startConnectingProcess();
		}
    }

	removeCallbacks() {
		if (!this._parentNode) {
			return ;
		}

		this._parentNode.removeEventListener("waiting-room-callback", this.waitingRoomVerifications);

		this._callback = false;
		this._observer.disconnect();
	}

    waitingRoomVerifications() {
		if (AbstractView.wsCreated) {
			this.loadDOMChanges();
		}

        if (!this._lobbyFull &&
            Object.keys(AbstractView.userQueue).length == this._lobbySize) {
			console.log("Lobby Is full!");
            this._lobbyFull = true;
			this.loadDOMChanges();
        } else if (this._lobbyFull &&
            Object.keys(AbstractView.userQueue).length != this._lobbySize) {
			console.log("Opponent left!");
            this._loading = true;
            this._lobbyFull = false;
            AbstractView.userData = {};
            closeWebsocket();
            this.startConnectingProcess();
        }

        if (Object.keys(AbstractView.userQueue).length == this._lobbySize &&
            Object.keys(AbstractView.userReadyList).length == this._lobbySize) {
            const allUsersReady = Object.values(AbstractViewuserReadyList).every(
				(ready) => ready
			);

			console.log("allUsersReady?", allUsersReady);
            
			if (allUsersReady) {
                navigateTo(
                    "/home/pong-game/play/multiplayer/" + this._lobbySize
                );
            }
        }
    }

    async loadDOMChanges() {
		console.log("Loading DOM changes")
		const parentNode = document.getElementById("waiting-room");
        const loadingIcon = parentNode.querySelector("loading-icon");
        if (loadingIcon) {
            loadingIcon.remove();
            parentNode.innerHTML = this.loadWaitingRoomContent();
        }
    }

    loadWaitingRoomContent() {
		console.log(AbstractView.wsCreated)
        return `
			<div class="p-3 p-lg-5 pd-xl-0">
				<div class="d-flex flex-row justify-content-center mb-4">
					<h3>Waiting for players</h3>
				</div>
				${(new PlayerQueue()).getHtml()}
				${
                    AbstractView.wsCreated
                        ? (this._lobbyFull ? (new ReadyButton()).getHtml() : `<loading-icon size="3rem"></loading-icon>`)
                        : `<loading-icon size="3rem"></loading-icon>`
                }
			</div>
		`;
    }

    getHtml() {
        if (this._loading) {
            return `
			<div class="d-flex flex-column col-md-6" id="waiting-room">
				<loading-icon size="5rem"></loading-icon>
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

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        //window.onbeforeunload = () => {
        //    this.removeCallbacks();
        //};
    }

    async defineCallback() {
        const parentNode = document.getElementById("player-queue");
        if (parentNode) {
            this._parentNode = parentNode;
			if (!this._callback) {
				this._callback = true;
				this._parentNode.addEventListener(
					"player-queue-callback", 
					this.waitingRoomVerifications.bind(this)
				);
			}
        } else {
            return;
        }
    }

    waitingRoomVerifications() {
        //if (!this._lobbyFull &&
        //    Object.keys(AbstractView.userQueue).length == this._lobbySize) {
		//	console.log("Lobby Is full!");
        //    this._lobbyFull = true;
        //} else if (this._lobbyFull &&
        //    Object.keys(AbstractView.userQueue).length != this._lobbySize) {
		//	console.log("Opponent left!");
        //    this._loading = true;
        //    this._lobbyFull = false;
        //    AbstractView.userData = {};
        //    closeWebsocket();
        //    this.startConnectingProcess();
        //}

        //if (Object.keys(AbstractView.userQueue).length == this._lobbySize &&
        //    Object.keys(AbstractView.userReadyList).length == this._lobbySize) {
        //    const allUsersReady = Object.values(AbstractViewuserReadyList).every(
		//		(ready) => ready
		//	);

		//	console.log("allUsersReady?", allUsersReady);
            
		//	if (allUsersReady) {
        //        navigateTo(
        //            "/home/pong-game/play/multiplayer/" + this._lobbySize
        //        );
        //    }
        //}
    }

    loadDOMChanges() {
		const parentNode = document.getElementById("player-queue");
        parentNode.innerHTML = this.loadPlayerQueueContent();
    }

    loadPlayerQueueContent() {
        return `
			<div class="d-flex flex-column justify-content-start align-items-start mb-3" id="player-queue">
			${!this._loading && AbstractView.userData
				? AbstractView.userData.map((data, index) =>
					data.avatar ? (
						`<React.Fragment key=${index}>
							<div class="d-flex flex-row mb-2">
								<img
									src=${data.avatar}
									alt="Avatar preview"
									width="40"
									height="40"
									class="avatar-border-sm"
									style="border-radius: 50%"
								/>
								<div class="d-flex flex-row justify-content-center">
									<div class="username-text ms-3 mt-2">
										<h5>${data.username}</h5>
									</div>
									<div class="ms-1 mt-2">
										<CheckIfReady
											data=${data}
											userReadyList=${userReadyList}
										/>
									</div>
								</div>
							</div>
						</React.Fragment>`
					) : (
						`<React.Fragment key=${index}>
							<div class="d-flex flex-row mb-2">
								<BaseAvatar
									width="40"
									height="40"
									template=""
								/>
								<div class="d-flex flex-row">
									<div class="username-text ms-3 mt-2">
										<h5>${data.username}</h5>
									</div>
									<div class="ms-1 mt-2">
										<CheckIfReady
											data=${data}
											userReadyList=${userReadyList}
										/>
									</div>
								</div>
							</div>
						</React.Fragment>`
					).join(''))
				:  `<loading-icon size="3rem"></loading-icon>`}
			</div>
		`;
    }

    getHtml() {
		console.log(this.loadPlayerQueueContent())
        return this.loadPlayerQueueContent();
	}
}
