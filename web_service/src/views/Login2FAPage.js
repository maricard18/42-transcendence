import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { navigateTo } from "../index";
import { decode, setToken } from "../functions/tokens";
import { validate2FAForm } from "../functions/validateForms";
import { transitDecrypt } from "../functions/vaultAccess";

export default class Login2FAPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login 2FA");
        this._parentNode = null;
        this._insideRequest = false;
        this._inputCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;
		this._test2FA = false;
		this._has2FA = false;

        this._errors = {};
        this._2FACode = null;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		this.removeCallbacksBound = this.removeCallbacks.bind(this);
		window.addEventListener("popstate", this.removeCallbacksBound);

		//console.log("Here");
    }

	inputCallback = (event) => {
		const value = event.target.value;
		event.target.setAttribute("value", value);
		this._2FACode = value;
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

    defineCallback() {
		//console.log("Running Main Callback function");
        const parentNode = document.getElementById("login-2FA-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        const input = this._parentNode.querySelector("input");
        if (input && !this._inputCallback) {
            this._inputCallback = true;
  			input.addEventListener("input", this.inputCallback);
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        if (!this._enterCallback) {
			console.log("EnterBef:", this._enterCallback);
            this._enterCallback = true;
			console.log("EnterAft:", this._enterCallback);
            window.addEventListener("keydown", this.keydownCallback);
        }
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        const input = this._parentNode.querySelector("input");
        if (input) {
            input.removeEventListener("input", this.inputCallback);
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.removeEventListener("keydown", this.keydownCallback);

		window.removeEventListener("popstate", this.removeCallbacksBound);

        this._observer.disconnect();
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this.errors.message) {
            const p = document.querySelector("p");
            p.innerText = this.errors.message;

            const input = document.querySelector("input");
			if (this.errors.code) {
				input.classList.add("input-error");
				this._2FACode = input.value;
				setTimeout(() => {
					input.classList.remove("input-error");
				}, 3000);
			} else if (input.classList.contains("input-error")) {
				input.classList.remove("input-error");
			}

			setTimeout(() => {
				p.innerHTML = "";
			}, 3000);
        }
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        let newErrors = validate2FAForm(this._2FACode);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
			const jsonResponse = await transitDecrypt(AbstractView.tokens);
			const blob = new Blob([jsonResponse], {type : 'application/json'});
			const newResponse = new Response(blob);
			const jsonData = await newResponse.clone().json();
            const accessToken = jsonData["access_token"];
			const decodeToken = decode(accessToken);

			if (!accessToken) {
				console.error("Error: failed to retrieve access token");
				navigateTo("/");
				return ;
			}

			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};

			const response = await fetchData(
				"/api/users/" + decodeToken["user_id"] + "/otp?code=" + this._2FACode,
				"GET",
				headers,
				null
			);

			const responseJSON = await response.json()
			if (response.ok && responseJSON['valid']) {
				this.removeCallbacks();
				await setToken(newResponse);
				AbstractView.has2FA = 2;
				navigateTo("/home");
            } else {
				if (responseJSON['valid'] === false) {
					newErrors = { message: "2FA code is invalid", code: 1 };
				} else {
					newErrors = { message: "failed to login with 2FA", code: 1 };
				}
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    async getHtml() {
		if (AbstractView.has2FA === null) {
			navigateTo("/");
			return ;
		}

        return `
			<div class="container" id="login-2FA-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
							<h1 class="header">Two-Factor Authentication</h1>
						</div>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="code"
								type="text"
								class="form-control primary-form extra-form-class"
								placeholder="6 digit code"
								value=""
							/>
						</div>
						<div>
							<submit-button
								type="button"
								template="primary-button extra-btn-class"
								value="Validate"
							>
							</submit-button>    
						</div>
					</div>
				</div>
			</div>
		`;
    }
}
