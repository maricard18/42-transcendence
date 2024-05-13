import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { decode, setToken } from "../functions/tokens";
import { validateLoginForm } from "../functions/validateForms";
import { transitEncrypt } from "../functions/vaultAccess";

export default class LoginPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
        this._parentNode = null;
        this._insideRequest = false;
        this._inputCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;
		this._test2FA = false;
		this._has2FA = false;

        this._errors = {};
        this._formData = {
            username: "",
            password: ""
        };

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		this.removeCallbacksBound = this.removeCallbacks.bind(this);
		window.addEventListener("popstate", this.removeCallbacksBound);
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

    async defineCallback() {
        const parentNode = document.getElementById("login-page");
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
            submitButton.addEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
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

        const submitButton = document.querySelector("submit-button");
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

        if (this._errors.message) {
            const p = document.querySelector("p");
            p.innerText = this._errors.message;

            const inputList = document.querySelectorAll("input");
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

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        let newErrors = validateLoginForm(this._formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("grant_type", "password");
            formDataToSend.append("username", await transitEncrypt(this._formData.username));
            formDataToSend.append("password", await transitEncrypt(this._formData.password));

            const response = await fetchData(
                "/auth/token",
                "POST",
                null,
                formDataToSend
            );

            if (response.ok) {
				await checkFor2FA(response.clone());
				this.removeCallbacks();
				if (AbstractView.has2FA) {
					const responseBody = await response.clone().json(); 
        			AbstractView.tokens = await transitEncrypt(JSON.stringify(responseBody));
					navigateTo("/login-2FA");
				} else {
					await setToken(response);
					navigateTo("/home");
				}
				
				return ;
            } else {
                newErrors = await handleResponse(response, this._formData);
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    async getHtml() {
        return `
			<div class="container" id="login-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
							<h1 class="header">Welcome back</h1>
						</div>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="username"
								type="username"
								class="form-control primary-form extra-form-class"
								placeholder="username"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="password"
								type="password"
								class="form-control primary-form extra-form-class"
								placeholder="password"
								value=""
							/>
						</div>
						<div>
							<submit-button
								type="button"
								template="primary-button extra-btn-class"
								value="Next"
							>
							</submit-button>    
						</div>
					</div>
				</div>
			</div>
		`;
    }
}

async function checkFor2FA(clone) {
	const jsonData = await clone.json();
    const accessToken = jsonData["access_token"];
	const decodeToken = decode(accessToken);
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const response = await fetchData(
		"/api/users/" + decodeToken["user_id"] + "/otp",
		"GET",
		headers,
		null
	);

	if (response.ok) {
		const jsonData = await response.json();
		if (jsonData["active"] === true) {
			console.log("User has 2FA active");
			AbstractView.has2FA = 2;
		} else if (jsonData["active"] === false) {
			console.log("User has 2FA active but is not valid");
			AbstractView.has2FA = 1;
		}

		return ;
	}

	console.log("User does not have 2FA active");
	AbstractView.has2FA = 0;
}