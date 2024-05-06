import AbstractView from "./AbstractView";
import {validateSignUpForm} from "../functions/validateForms";
import {navigateTo} from "../index";

export default class SignUpPage extends AbstractView {
    constructor() {
        super();
        AbstractView.cleanUserData();
        this.setTitle("Sign Up");
        this._parentNode = null;
        this._callbacksDefined = false;
        this._insideRequest = false;
        this._inputCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;

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
        const parentNode = document.getElementById("sign-up-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.inputCallback = (event) => {
            const id = event.target.getAttribute("id");
            const value = event.target.value;
            event.target.setAttribute("value", value);
            AbstractView.formData[id] = value;
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

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.removeEventListener("keydown", this.keydownCallback);

        this._inputCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;
        this._observer.disconnect();
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this.errors.message) {
            const p = this._parentNode.querySelector("p");
            p.innerText = this.errors.message;

            const inputList = this._parentNode.querySelectorAll("input");
            inputList.forEach((input) => {
                const id = input.getAttribute("id");
                if (this.errors[id]) {
                    input.classList.add("input-error");
                    AbstractView.formData[id] = input.value;
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
        const newErrors = validateSignUpForm(AbstractView.formData);
        if (Object.values(newErrors).length !== 0) {
            this._errors = newErrors;
        }

        if (!newErrors.message) {
            this.removeCallbacks();
            navigateTo("/create-profile");
        }

        this._insideRequest = false;
    }

    async getHtml() {
        return `
			<div class="container" id="sign-up-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
							<h1 class="header">Sign Up</h1>
						</div>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="email"
								type="email"
								class="form-control primary-form extra-form-class"
								placeholder="email"
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
						<div class="mb-3">
							<input
								id="confirmPassword"
								type="password"
								class="form-control primary-form extra-form-class"
								placeholder="confirm password"
								value=""
							/>
						</div>
						<div class="mt-3">
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
