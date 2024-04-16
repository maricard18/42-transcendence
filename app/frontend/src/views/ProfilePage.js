import AbstractView from "./AbstractView";
import { validateSignUpForm } from "../functions/validateForms";
import { navigateTo } from "../index.js";

export default class CreateProfile extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Profile");
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
        const inputBox = document.querySelector("input");
        inputBox.setAttribute(
			"value",
			this.formData[inputBox.getAttribute("id")]
		);

		if (!newErrors.message) {
			navigateTo("/menu");
		} else {
			this.render();
		}
    }

    defineCallback() {
        const inputBox = document.querySelectorAll("input-box");
		inputBox.addEventListener("inputValueChanged", (event) => {
			this.formData = {
				...this.formData,
				[event.detail.id]: event.detail.value,
			};
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
        document.querySelector("#create-profile-page").innerHTML =
            await this.getHtml();
    }

    async getHtml() {
        return `
			<div class="container" id="create-profile-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<form>
							<div class="mb-5">
								<Avatar setFile={setFile} />
							</div>
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
                                        template="${
                                            this.errors.username
                                                ? "input-error"
                                                : ""
                                        }"
                                        placeholder="username"
                                        value="${this.formData.username}"
                                    ></input-box>
                                </div>
								<div>
									<SubmitButton
										template="secondary-button"
										onClick={handleValidation}
									>
										Next
									</SubmitButton>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
        `;
    }
}
