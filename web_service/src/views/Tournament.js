import AbstractView from "./AbstractView";
import { navigateTo } from "../index";
import { validateTournamentForm } from "../functions/validateForms";

export default class Tournament extends AbstractView {
    constructor() {
        super();
        this._insideRequest = false;
        this._inputCallback = false;
        this._enterCallback = false;

		this._formData = {
			"username1": "",
			"username2": "",
			"username3": "",
			"username4": "",
		};
        this._errors = {};

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
        };
    }

    defineCallback() {
        const parentNode = document.getElementById("tournament-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.inputCallback = (event) => {
            const id = event.target.getAttribute("id");
            const value = event.target.value;
            event.target.setAttribute("value", value);
            this._formData[id] = value;
        };

        this.buttonClickedCallback = () => {
            this.handleValidation();
        };

        this.keydownCallback = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.handleValidation();
            }
        };

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

    removeCallbacks() {
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

        window.removeEventListener("keydown", this.keydownCallback);

        this._inputCallback = false;
        this._avatarCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;
        this._observer.disconnect();
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
                } else if (input.classList.contains("input-error")) {
                    input.classList.remove("input-error");
                }
            });
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
			localStorage.setItem("username1", this._formData.username1);
			localStorage.setItem("username2", this._formData.username2);
			localStorage.setItem("username3", this._formData.username3);
			localStorage.setItem("username4", this._formData.username4);
            navigateTo("/home/pong/tournament/matchmaking");
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
        this._view = view;

		this._tournament = {
			player1: localStorage.getItem("username1"),
			player2: localStorage.getItem("username2"),
			player3: localStorage.getItem("username3"),
			player4: localStorage.getItem("username4"),
		}

		if (Object.values(this._tournament).every((value) => value === "")) {
            setTimeout(() => {
                navigateTo("/home/pong/tournament/creation");
            }, 5);
            return;
        } else {
			setTimeout(() => {
				console.log("Old-Order:", this._tournament);
				this._tournament = this.shuffleArray(Object.entries(this._tournament));
				console.log("New-Order:", this._tournament);
                this.loadDOMChanges();
            }, 5000);
		}
    }

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	loadDOMChanges() {
        const parentNode = document.getElementById("tournament-matchmaking");
        const loadingIcon = parentNode.querySelector("loading-icon");
        if (loadingIcon) {
            loadingIcon.remove();
        }
		
		parentNode.innerHTML = this.loadMatchmakingContent();
    }

	loadMatchmakingContent() {
		return `
			<div class="d-flex flex-column flex-md-row  align-items-center justify-content-center justify-content-md-evenly vh-100 row">
				<div class="d-flex flex-column col-md-6 box p-3">
					<h3 style="font-size: 40px; font-weight: bold">First match</h3>
					<div class="d-flex flex-row justify-content-center mt-3">
						<div class="d-flex flex-column align-items-center">
							<base-avatar-box 
								size="50px"
								template="white-border-sm"
							></base-avatar-box>
							<h1 class="mt-2" style="font-size: 20px">${this._tournament[0][1]}</h1>
						</div>
						<div class="d-flex flex-column align-items-center justify-content-center">
							<div class="ms-3 me-3">
								<h1 style="font-weight: bold">VS</h1>
							</div>
						</div>
						<div class="d-flex flex-column align-items-center">
							<base-avatar-box 
								size="50px"
								template="white-border-sm"
							></base-avatar-box>
							<h1 class="mt-2" style="font-size: 20px">${this._tournament[1][1]}</h1>
						</div>
					</div>
				</div>
				<div class="d-flex flex-column col-md-6 box p-3">
					<h3 style="font-size: 40px; font-weight: bold">Second match</h3>
					<div class="d-flex flex-row justify-content-center mt-3">
						<div class="d-flex flex-column align-items-center">
							<base-avatar-box 
								size="50px"
								template="white-border-sm"
							></base-avatar-box>
							<h1 class="mt-2" style="font-size: 20px">${this._tournament[2][1]}</h1>
						</div>
						<div class="d-flex flex-column align-items-center justify-content-center">
							<div class="ms-3 me-3">
								<h1 style="font-weight: bold">VS</h1>
							</div>
						</div>
						<div class="d-flex flex-column align-items-center">
							<base-avatar-box 
								size="50px"
								template="white-border-sm"
							></base-avatar-box>
							<h1 class="mt-2" style="font-size: 20px">${this._tournament[3][1]}</h1>
						</div>
					</div>
				</div>
			</div>
        `;
	}

    async getHtml() {
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
    }
}
