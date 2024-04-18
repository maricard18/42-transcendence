import AbstractView from "./AbstractView";
import { validateSignUpForm } from "../functions/validateForms";
import { navigateTo } from "../index";

export default class SignUpPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Sign up");
        this._loading = true;
        this._callbacksRemoved = true;
		this._insideRequest = false;
        this._errors = {};

        this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
            this.disconnectObserver();
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
    }

    async handleValidation() {
		if (this._insideRequest) {
            return;
        }

		this._insideRequest = true;
        const newErrors = validateSignUpForm(this.formData);
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
            this.removeCallbacks();
            this.disconnectObserver();
            navigateTo("/create-profile");
        } else {
            this.render();
        }

		this._insideRequest = false;
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

        const element = document.querySelector("#sign-up-page");
        if (element) {
            element.innerHTML = await this.getHtml();
        }
    }

    async getHtml() {
        return `
		<div class="container" id="sign-up-page">
			<div class="center">
				<div class="d-flex flex-column justify-content-center">
					<div class="mb-3">
						<h1 class="header mb-4">Sign Up</h1>
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
									id="email"
									type="email"
									template="${this.errors.email ? "input-error" : ""}"
									placeholder="email"
									value="${this.formData.email}"
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
							<div class="mb-1">
								<input-box
									id="confirmPassword"
									type="password"
									template="${this.errors.confirmPassword ? "input-error" : ""}"
									placeholder="confirm password"
									value="${this.formData.confirmPassword}"
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
