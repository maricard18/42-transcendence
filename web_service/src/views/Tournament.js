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
								placeholder="player 1 name"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username2"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 2 name"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username3"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 3 name"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="username4"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="player 4 name"
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

		console.log("PlayersInfo:", this._tournament);

		if (Object.values(this._tournament).every((value) => value === "")) {
            setTimeout(() => {
                navigateTo("/home/pong/tournament/creation");
            }, 5);
            return;
        } else {
			setTimeout(() => {
                this.loadDOMChanges();
            }, 5000);
		}
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
			<div class="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-evenly vh-100 row">
				<div class="d-flex flex-column">
					<h1>test 1</h1>
				</div>
				<div class="d-flex flex-column">
					<h1>test 2</h1>
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
