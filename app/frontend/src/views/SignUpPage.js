import AbstractView from "./AbstractView";
import { validateSignUpForm } from "../functions/validateForms";
import { navigateTo } from "../index.js";

export default class SignUpPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Sign up");
        this._loading = true;
        this._formData = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };
        this._errors = {};

        this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    get formData() {
        return this._formData;
    }

    set formData(value) {
        this._formData = value;
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;
        this.render();
    }

    async handleValidation() {
        const newErrors = validateSignUpForm(this.formData);
        this.errors = newErrors;
		console.log(newErrors);
		console.log(this.formData)
        document.querySelectorAll("input").forEach((inputBox) => {
            inputBox.setAttribute(
                "value",
                this.formData[inputBox.getAttribute("id")]
            );
        });

		if (!newErrors.message) {
			navigateTo("/create-profile");
		} else {
			this.render();
		}
    }

    defineCallback() {
        document.querySelectorAll("input-box").forEach((inputBox) => {
            inputBox.addEventListener("inputValueChanged", (event) => {
                this.formData = {
                    ...this.formData,
                    [event.detail.id]: event.detail.value,
                };
            });
        });
		
        const submitButton = document.querySelector("submit-button");
		if (submitButton) {
			submitButton.addEventListener("buttonWasClicked", (event) => {
				this.handleValidation();
			});
		}

		window.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				this.handleValidation();
			}
		});
    }

    async render() {
        document.querySelector("#sign-up-page").innerHTML =
            await this.getHtml();
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
                                        template="${
                                            this.errors.email
                                                ? "input-error"
                                                : ""
                                        }"
                                        placeholder="email"
                                        value="${this.formData.email}"
                                    ></input-box>
                                </div>
								<div class="mb-1">
                                    <input-box
                                        id="password"
                                        type="password"
                                        template="${
                                            this.errors.password
                                                ? "input-error"
                                                : ""
                                        }"
                                        placeholder="password"
                                        value="${this.formData.password}"
                                    ></input-box>
                                </div>
								<div class="mb-1">
                                    <input-box
                                        id="confirmPassword"
                                        type="password"
                                        template="${
                                            this.errors.confirmPassword
                                                ? "input-error"
                                                : ""
                                        }"
                                        placeholder="confirm password"
                                        value="${this.formData.confirmPassword}"
                                    ></input-box>
                                </div>
								<div class="mt-2">
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
