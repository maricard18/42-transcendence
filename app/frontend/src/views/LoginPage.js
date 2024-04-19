import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { setToken } from "../functions/tokens";
import { validateLoginForm } from "../functions/validateForms";

export default class LoginPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
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

        this.buttonClickedCallback = () => {
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
                    input.setAttribute("value", "");
                    input.value = "";
                }
            });
        }
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        let newErrors = validateLoginForm(this.formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            console.log(this.formData);
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
                navigateTo("/home");
            } else {
                newErrors = await handleResponse(response, this.formData);
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
					<form>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="username"
								type="username"
								class="form-control primary-form"
								placeholder="username"
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
