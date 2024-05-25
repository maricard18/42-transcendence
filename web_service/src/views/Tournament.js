import AbstractView from "./AbstractView";
import { navigateTo } from "../index";
import { validateTournamentForm } from "../functions/validateForms";

export default class Tournament extends AbstractView {
    constructor() {
        super();
        this._insideRequest = false;
        this._inputCallback = false;
        this._enterCallback = false;

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }

        this._formData = {
            "username1": "",
            "username2": "",
            "username3": "",
            "username4": "",
        };
        this._errors = {};

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.addEventListener(location.pathname, this.removeCallbacks);
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this._errors.message) {
            const p = this._parentNode.querySelector("p");
            p.innerText = this._errors.message;

            const inputList = this._parentNode.querySelectorAll("input");
            inputList.forEach((input) => {
                const id = input.getAttribute("id");
                if (this._errors[id]) {
                    input.classList.add("input-error");
                    this._formData[id] = input.value;
                    setTimeout(() => {
                        input.classList.remove("input-error");
                    }, 3000);
                } else if (input.classList.contains("input-error")) {
                    input.classList.remove("input-error");
                }
            });

            setTimeout(() => {
                p.innerText = "";
            }, 3000);
        }
    }

    inputCallback = (event) => {
        const id = event.target.getAttribute("id");
        const value = event.target.value;
        event.target.setAttribute("value", value);
        this._formData[id] = value;
    };

    buttonClickedCallback = () => {
        this.handleValidation();
    };

    keydownCallback = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.handleValidation();
        }
    };

    defineCallback = () => {
        const parentNode = document.getElementById("tournament-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        const inputList = this._parentNode.querySelectorAll("input");
        if (inputList && inputList.length && !this._inputCallback) {
            this._inputCallback = true;
            this._parentNode.querySelectorAll("input").forEach((input) => {
                input.addEventListener("input", this.inputCallback);
            });
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener("buttonClicked", this.buttonClickedCallback);
        }

        if (!this._enterCallback) {
            this._enterCallback = true;
            window.addEventListener("keydown", this.keydownCallback);
        }
    }

    removeCallbacks = () => {
        this._observer.disconnect();
        window.removeEventListener("keydown", this.keydownCallback);
        window.removeEventListener(location.pathname, this.removeCallbacks);

        if (!this._parentNode) {
            return;
        }

        const inputList = this._parentNode.querySelectorAll("input");
        if (inputList) {
            this._parentNode.querySelectorAll("input").forEach((input) => {
                input.removeEventListener("input", this.inputCallback);
            });
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener("buttonClicked", this.buttonClickedCallback);
        }
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        const newErrors = validateTournamentForm(this._formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            this.removeCallbacks();
            localStorage.setItem("user1-name", this._formData.username1);
            localStorage.setItem("user2-name", this._formData.username2);
            localStorage.setItem("user3-name", this._formData.username3);
            localStorage.setItem("user4-name", this._formData.username4);
            localStorage.setItem("user1-image", "/static/images/harry-potter.png");
            localStorage.setItem("user2-image", "/static/images/darth-vader.png");
            localStorage.setItem("user3-image", "/static/images/spider-man.png");
            localStorage.setItem("user4-image", "/static/images/angry-birds.png");

            if (this._game === "pong") {
                navigateTo("/home/pong/tournament/matchmaking");
            } else {
                navigateTo("/home/tic-tac-toe/tournament/matchmaking");
            }
        }

        this._insideRequest = false;
    }

    async getHtml() {
        return `
			<div class="container" id="tournament-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
							<h1 class="header">Pick your nicknames</h1>
						</div>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="username1"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 1 nickname"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username2"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 2 nickname"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username3"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 3 nickname"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username4"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 4 nickname"
								value=""
							/>
						</div>
						<div class="mt-3">
							<submit-button
								type="button"
								template="primary-button extra-btn-class"
								value="Create Tournament"
							>
							</submit-button>    
						</div>
					</div>
				</div>
			</div>
		`;
    }
}

export class TournamentMatchmaking extends AbstractView {
    constructor(view) {
        super();
        this._parentNode = null;
        this._loading = null;
        this._clickCallback = false;
        this._enterCallback = false;
        this._tournament = null;
        this._finalMatch = {};
        this._match1 = JSON.parse(localStorage.getItem("match1"));
        this._match2 = JSON.parse(localStorage.getItem("match2"));
        this._match3 = JSON.parse(localStorage.getItem("match3"));

        const currentLocation = location.pathname;
        if (currentLocation.charAt(6) === "p") {
            this._game = "pong";
        } else {
            this._game = "tic-tac-toe";
        }

        if (!localStorage.getItem("tournament")) {
            this._tournament = {
                1: [localStorage.getItem("user1-name"), localStorage.getItem("user1-image")],
                2: [localStorage.getItem("user2-name"), localStorage.getItem("user2-image")],
                3: [localStorage.getItem("user3-name"), localStorage.getItem("user3-image")],
                4: [localStorage.getItem("user4-name"), localStorage.getItem("user4-image")],
            }
        } else {
            this._tournament = JSON.parse(localStorage.getItem("tournament"));
        }

        if (this._match3 && this._match3["status"] === "finished") {
            let player;
            for (let i = 0; i < this._tournament.length; i++) {
                if (this._tournament[i][0] === this._match3["winner"]) {
                    player = this._tournament[i];
                }
            }
        }

        if (this._match1 && this._match1["status"] === "finished") {
            let player1;
            for (let i = 0; i < this._tournament.length; i++) {
                if (this._tournament[i][0] === this._match1["winner"]) {
                    player1 = this._tournament[i];
                }
            }

            this._finalMatch["1"] = ([player1[0], player1[1]]);
        }
        if (this._match2 && this._match2["status"] === "finished") {
            let player2;
            for (let i = 0; i < this._tournament.length; i++) {
                if (this._tournament[i][0] === this._match2["winner"]) {
                    player2 = this._tournament[i];
                }
            }

            this._finalMatch["2"] = ([player2[0], player2[1]]);
        }

        if (!this._tournament || !this._tournament["1"][0] || !this._tournament["1"][1][0]) {
            setTimeout(() => {
                if (this._game === "pong") {
                    navigateTo("/home/pong/tournament/creation");
                } else {
                    navigateTo("/home/tic-tac-toe/tournament/creation");
                }
            }, 5);
            return;
        } else {
            if (!localStorage.getItem("tournament")) {
                this._loading = true;
                setTimeout(() => {
                    this._tournament = this.shuffleArray(Object.entries(this._tournament));
                    this._tournament.push(["status", "not finished"]);
                    localStorage.setItem("tournament", JSON.stringify(this._tournament));
                    this._loading = false;
                    this.loadDOMChanges();
                }, 3000);
            } else {
                this._loading = false;
            }
        }

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.addEventListener(location.pathname, this.removeCallbacks);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    buttonClickedCallback = () => {
        if (!localStorage.getItem("match1")) {
            const match1 = {
                status: "not finished",
                winner: null,
                player1: {
                    index: this._tournament[0][0],
                    username: this._tournament[0][1][0],
                    avatar: this._tournament[0][1][1]
                },
                player2: {
                    index: this._tournament[1][0],
                    username: this._tournament[1][1][0],
                    avatar: this._tournament[1][1][1]
                }
            }
            localStorage.setItem("match1", JSON.stringify(match1));
        } else if (!localStorage.getItem("match2")) {
            const match2 = {
                status: "not finished",
                winner: null,
                player1: {
                    index: this._tournament[2][0],
                    username: this._tournament[2][1][0],
                    avatar: this._tournament[2][1][1]
                },
                player2: {
                    index: this._tournament[3][0],
                    username: this._tournament[3][1][0],
                    avatar: this._tournament[3][1][1]
                }
            }
            localStorage.setItem("match2", JSON.stringify(match2));
        } else if (!localStorage.getItem("match3")) {
            const match3 = {
                status: "not finished",
                winner: null,
                player1: {
                    index: this._finalMatch["1"][0][0],
                    username: this._finalMatch["1"][1][0],
                    avatar: this._finalMatch["1"][1][1]
                },
                player2: {
                    index: this._finalMatch["2"][0],
                    username: this._finalMatch["2"][1][0],
                    avatar: this._finalMatch["2"][1][1]
                }
            }
            localStorage.setItem("match3", JSON.stringify(match3));
        } else {
            this.removeCallbacks();
            navigateTo("/home");
            return;
        }

        this.removeCallbacks();

        if (this._game === "pong") {
            navigateTo("/home/pong/play/tournament/2");
        } else {
            navigateTo("/home/tic-tac-toe/play/tournament/2");
        }
    };

    keydownCallback = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.buttonClickedCallback();
        }
    };

    defineCallback = () => {
        const parentNode = document.getElementById("tournament-matchmaking");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener("click", this.buttonClickedCallback);
        }

        if (!this._enterCallback) {
            this._enterCallback = true;
            window.addEventListener("keydown", this.keydownCallback);
        }
    }

    removeCallbacks = () => {
        this._observer.disconnect();

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener("buttonClicked", this.buttonClickedCallback);
        }

        window.removeEventListener("keydown", this.keydownCallback);
        window.removeEventListener(location.pathname, this.removeCallbacks);
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("tournament-matchmaking");
        if (parentNode) {
            parentNode.innerHTML = this.loadMatchmakingContent();
        }
    }

    loadMatchmakingContent() {
        const tournament = JSON.parse(localStorage.getItem("tournament"));
        let buttonText;
        if (!this._match1) {
            buttonText = "Start Match 1";
        } else if (!this._match2) {
            buttonText = "Start Match 2";
        } else if (!this._match3) {
            buttonText = "Start Final Match";
        } else if (tournament && tournament[4][0] === "finished") {
            buttonText = "Home";
        }

        return `
			<div class="d-flex flex-column justify-content-center vh-100">
				<div class="d-flex flex-column flex-md-row  align-items-center justify-content-center justify-content-md-evenly m-2">
					<div class="d-flex flex-column col-md-6 box m-2" style="width: 400px">
						<h3 style="font-size: 40px; font-weight: bold">Match 1</h3>
						<div class="d-flex flex-row justify-content-center mt-4">
							<div class="d-flex flex-column align-items-center">
								<img
									src="${this._tournament[0][1][1]}"
									alt="Avatar preview"
									width="50"
									height="50"
									class="${
            this._match1 && this._match1["winner"] === this._match1["player1"]["index"]
                ? `gold-border-sm`
                : `white-border-sm`
        }"
									style="border-radius: 50%"
								/>
								<h1 class="mt-2" style="font-size: 20px">${this._tournament[0][1][0]}</h1>
							</div>
							<div class="d-flex flex-column align-items-center justify-content-start">
								<div class="ms-4 me-4">
									<h1 style="font-weight: bold; font-size: 50px">VS</h1>
								</div>
							</div>
							<div class="d-flex flex-column align-items-center">
								<img
									src="${this._tournament[1][1][1]}"
									alt="Avatar preview"
									width="50"
									height="50"
									class="${
            this._match1 && this._match1["winner"] === this._match1["player2"]["index"]
                ? `gold-border-sm`
                : `white-border-sm`
        }"
									style="border-radius: 50%"
								/>
								<h1 class="mt-2" style="font-size: 20px">${this._tournament[1][1][0]}</h1>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column col-md-6 box m-2" style="width: 400px">
						<h3 style="font-size: 40px; font-weight: bold">Match 2</h3>
						<div class="d-flex flex-row justify-content-center mt-4">
							<div class="d-flex flex-column align-items-center">
								<img
									src="${this._tournament[2][1][1]}"
									alt="Avatar preview"
									width="50"
									height="50"
									class="${
            this._match2 && this._match2["winner"] === this._match2["player1"]["index"]
                ? `gold-border-sm`
                : `white-border-sm`
        }"
									style="border-radius: 50%"
								/>
								<h1 class="mt-2" style="font-size: 20px">${this._tournament[2][1][0]}</h1>
							</div>
							<div class="d-flex flex-column align-items-center justify-content-start">
								<div class="ms-4 me-4">
									<h1 style="font-weight: bold; font-size: 50px">VS</h1>
								</div>
							</div>
							<div class="d-flex flex-column align-items-center">
								<img
									src="${this._tournament[3][1][1]}"
									alt="Avatar preview"
									width="50"
									height="50"
									class="${
            this._match2 && this._match2["winner"] === this._match2["player2"]["index"]
                ? `gold-border-sm`
                : `white-border-sm`
        }"
									style="border-radius: 50%"
								/>
								<h1 class="mt-2" style="font-size: 20px">${this._tournament[3][1][0]}</h1>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex flex-column flex-md-row  align-items-center justify-content-center m-2">
					<div class="d-flex flex-column col-md-6 box m-2" style="width: 400px">
						<h3 style="font-size: 40px; font-weight: bold">Final Match</h3>
						<div class="d-flex flex-row justify-content-center mt-4">
							<div class="d-flex flex-column align-items-center">
							${
            this._match1
                ? `<img
											src="${this._finalMatch["1"][1][1]}"
											alt="Avatar preview"
											width="50"
											height="50"
											class="${
                    this._match3 && this._match3["winner"] === this._match3["player1"]["index"]
                        ? `gold-border-sm`
                        : `white-border-sm`
                }"
											style="border-radius: 50%"
										/>
										<h1 class="mt-2" style="font-size: 20px">${this._finalMatch["1"][1][0]}</h1>`
                : `<base-avatar-box
											size="50px"
											template="white-border-sm"
										></base-avatar-box>
										<h1 class="mt-2" style="font-size: 20px">Winner 1</h1>`
        }
							</div>
							<div class="d-flex flex-column align-items-center justify-content-start">
								<div class="ms-4 me-4">
									<h1 style="font-weight: bold; font-size: 50px">VS</h1>
								</div>
							</div>
							<div class="d-flex flex-column align-items-center">
							${
            this._match2
                ? `<img
											src="${this._finalMatch["2"][1][1]}"
											alt="Avatar preview"
											width="50"
											height="50"
											class="${
                    this._match3 && this._match3["winner"] === this._match3["player2"]["index"]
                        ? `gold-border-sm`
                        : `white-border-sm`
                }"
											style="border-radius: 50%"
										/>
										<h1 class="mt-2" style="font-size: 20px">${this._finalMatch["2"][1][0]}</h1>`
                : `<base-avatar-box
											size="50px"
											template="white-border-sm"
										></base-avatar-box>
										<h1 class="mt-2" style="font-size: 20px">Winner 2</h1>`
        }
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex flex-row justify-content-center mt-4">
					<submit-button
						type="button"
						template="white-button extra-btn-class"
						style="font-size: 20px"
						value="${buttonText}"
					></submit-button>
				</div>
			</div>
        `;
    }

    async getHtml() {
        if (this._loading) {
            return `
				<div class="container" id="tournament-matchmaking">
					<div class="d-flex flex-column center">
						<div class="mb-5">
							<h1 class="header">Sorting tournament order</h1>
						</div>
						<loading-icon size="5rem"></loading-icon>
					</div>
				</div>
			`;
        } else {
            if (!this._tournament || !this._tournament["1"][0] || !this._tournament["1"][1][0]) {
                return;
            }

            return `
				<div class="container" id="tournament-matchmaking">
					${this.loadMatchmakingContent()}
				</div>
			`;
        }
    }
}

export function findTournamentMatch() {
    const match1 = JSON.parse(localStorage.getItem("match1"));
    const match2 = JSON.parse(localStorage.getItem("match2"));
    const match3 = JSON.parse(localStorage.getItem("match3"));

    if (match1 && match1["status"] !== "finished") {
        return match1;
    } else if (match2 && match2["status"] !== "finished") {
        return match2;
    } else if (match3 && match3["status"] !== "finished") {
        return match3;
    }

    return null;
}

export function findTournamentWinner(game, players) {
    let match1 = JSON.parse(localStorage.getItem("match1"));
    let match2 = JSON.parse(localStorage.getItem("match2"));
    let match3 = JSON.parse(localStorage.getItem("match3"));
    let tournament = JSON.parse(localStorage.getItem("tournament"));

    for (let i = 0; i < players.length; i++) {
        if (players[i].info["username"] === game.winner) {
            if (match1 && match1["status"] !== "finished") {
                match1["winner"] = i === 0 ? match1["player1"]["index"] : match1["player2"]["index"];
                match1["status"] = "finished";
                localStorage.setItem("match1", JSON.stringify(match1));
            } else if (match2 && match2["status"] !== "finished") {
                match2["winner"] = i === 0 ? match2["player1"]["index"] : match2["player2"]["index"];
                match2["status"] = "finished";
                localStorage.setItem("match2", JSON.stringify(match2));
            } else if (match3 && match3["status"] !== "finished") {
                match3["winner"] = i === 0 ? match3["player1"]["index"] : match3["player2"]["index"];
                match3["status"] = "finished";
                tournament[4][0] = "finished";
                localStorage.setItem("match3", JSON.stringify(match3));
                localStorage.setItem("tournament", JSON.stringify(tournament));
            }
        }
    }
}