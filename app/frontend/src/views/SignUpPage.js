import AbstractView from "./AbstractView";
import { validateSignUpForm } from "../functions/validateForms";
import { navigateTo } from "../index";

export default class SignUpPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Sign up");
        this._loading = true;
        this._callbacksDefined = false;
        this._insideRequest = false;
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
        if (this._callbacksDefined) {
            return;
        }

        this._callbacksDefined = true;

        this.inputCallback = (event, input) => {
            const id = input.getAttribute("id");
            const value = event.target.value;
            input.setAttribute("value", value);
            this.formData = {
                ...this.formData,
                [id]: value,
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

        document.querySelectorAll("input").forEach((input) => {
            input.addEventListener("input", (event) =>
                this.inputCallback(event, input)
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
    }

    removeCallbacks() {
        document.querySelectorAll("input").forEach((input) => {
            input.removeEventListener("input", this.inputCallback);
        });

        const submitButton = document.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.removeEventListener("keydown", this.keydownCallback);

        this._observer.disconnect();
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

        if (this.errors.message) {
            const p = document.querySelector("p");
            p.innerText = this.errors.message;

            const inputList = document.querySelectorAll("input");
            inputList.forEach((input) => {
                const id = input.getAttribute("id");
                if (this.errors[id]) {
                    input.classList.add("input-error");
                }
            });
        }
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
					<form>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="email"
								type="email"
								class="form-control primary-form"
								placeholder="email"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="password"
								type="password"
								class="form-control primary-form"
								placeholder="password"
								value=""
							/>
						</div>
						<div class="mb-3">
							<input
								id="confirmPassword"
								type="password"
								class="form-control primary-form"
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
					</form>
				</div>
			</div>
		</div>
        `;
    }
}
