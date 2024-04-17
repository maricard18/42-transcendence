import AbstractView from "./AbstractView.js";
import fetchData from "../functions/fetchData.js";
import handleResponse from "../functions/authenticationErrors.js";
import { navigateTo } from "../index.js";
import { setToken } from "../functions/tokens.js";
import { validateLoginForm } from "../functions/validateForms.js";

export default class LoginPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
        this._loading = true;
        this._callbacksRemoved = true;
        this._errors = {};
        console.log(AbstractView.formData);

        this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		window.onbeforeunload = () => {
			this.removeCallbacks();
			this.disconnectObserver()
		};
    }

    get formData() {
        return AbstractView.formData;
    }

    set formData(value) {
        AbstractView.formData = value;
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;
        this.render();
    }

    async handleValidation() {
        const newErrors = validateLoginForm(this.formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        document.querySelectorAll("input").forEach((inputBox) => {
            inputBox.setAttribute(
                "value",
                this.formData[inputBox.getAttribute("id")]
            );
        });

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("grant_type", "password");
            formDataToSend.append("username", this.formData.username);
            formDataToSend.append("password", this.formData.password);

            const response = await fetchData(
                "/auth/token",
                "POST",
                null,
                formDataToSend
            );

            if (response.ok) {
                await setToken(response, AbstractView.authed);
                this.removeCallbacks();
                this.disconnectObserver();
                navigateTo("/home");
            } else {
                newErrors = await handleResponse(response, this.formData);
                this.errors = newErrors;
            }
        }
    }

    defineCallback() {
        if (!this._callbacksRemoved) {
            return;
        }

        this.inputChangedCallback = (event) => {
            this.formData = {
                ...this.formData,
                [event.detail.id]: event.detail.value,
            };
			console.log(this.formData)
        };

        this.buttonClickedCallback = (event) => {
            this.handleValidation();
        };

        this.keydownCallback = (event) => {
            if (event.key === "Enter") {
				event.preventDefault();
				this.handleValidation();
			}
        };

        document.querySelectorAll("input-box").forEach((inputBox) => {
            inputBox.addEventListener(
                "inputChanged",
                this.inputChangedCallback
            );
        });

        const submitButton = document.querySelector("submit-button");
        if (submitButton) {
            submitButton.addEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.addEventListener("keydown", this.keydownCallback);
        this._callbacksRemoved = false;
    }

    removeCallbacks() {
        document.querySelectorAll("input-box").forEach((inputBox) => {
            inputBox.removeEventListener(
                "inputChanged",
                this.inputChangedCallback
            );
        });

        const submitButton = document.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.removeEventListener("keydown", this.keydownCallback);
        this._callbacksRemoved = true;
    }

    disconnectObserver() {
        this.observer.disconnect();
    }

    async render() {
        this.removeCallbacks();

        const element = document.querySelector("#login-page");
        if (element) {
            element.innerHTML = await this.getHtml();
        }
    }

    async getHtml() {
        return `
		<div class="container" id="login-page">
			<div class="center">
				<div class="d-flex flex-column justify-content-center">
					<div class="mb-3">
						<h1 class="header mb-4">Welcome back</h1>
					</div>
					<form>
						<div class="position-relative">
							${
                                Object.keys(this.errors).length !== 0
                                    ? `<p class="form-error">${this.errors.message}</p>`
                                    : ""
                            }
							<div class="mb-1">
								<input-box
									id="username"
									type="username"
									template="${this.errors.username ? "input-error" : ""}"
									placeholder="username"
									value="${this.formData.username}"
								></input-box>
							</div>
							<div class="mb-1">
								<input-box
									id="password"
									type="password"
									template="${this.errors.password ? "input-error" : ""}"
									placeholder="password"
									value="${this.formData.password}"
								></input-box>
							</div>
							<div class="mt-3">
								<submit-button
									type="button"
									template="primary-button"
									value="Next"
								>
								</submit-button>	
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	`;
    }
}
