import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import {validateProfilePasswordForm} from "../functions/validateForms";
import {getToken} from "../functions/tokens";
import {transitEncrypt} from "../functions/vaultAccess";

export default class ChangePassword extends AbstractView {
    constructor() {
        super();
        this._loading = true;
        this._parentNode = null;
        this._insideRequest = false;

        this._inputCallback = false;
        this._clickCallback = false;
        this._enterCallback = false;

        this._errors = {};
        this._success = {};
        this._formData = {
            password: "",
            confirmPassword: "",
        };

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
        };
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this.errors.message) {
            const p = this._parentNode.querySelector("p");
            if (p.classList.contains("form-success")) {
                p.classList.remove("form-success");
            }
            p.classList.add("form-error");
            p.innerText = this.errors.message;

            const inputList = this._parentNode.querySelectorAll("input");
            inputList.forEach((input) => {
                const id = input.getAttribute("id");
                if (this.errors[id]) {
                    input.classList.add("input-error");
                    this._formData[id] = input.value;
                } else if (input.classList.contains("input-error")) {
                    input.classList.remove("input-error");
                }
            });
        }
    }

    get success() {
        return this._success;
    }

    set success(value) {
        this._success = value;

        if (this.success.message) {
            const p = this._parentNode.querySelector("p");
            if (p.classList.contains("form-error")) {
                p.classList.remove("form-error");
            }
            p.classList.add("form-success");
            p.innerText = this.success.message;

            const inputList = this._parentNode.querySelectorAll("input");
            inputList.forEach((input) => {
                if (input.classList.contains("input-error")) {
                    input.classList.remove("input-error");
                }
            });
        }
    }

    defineCallback() {
        const parentNode = document.getElementById("change-user-info");

        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.inputCallback = (event) => {
            const id = event.target.getAttribute("id");
            const value = event.target.value;
            event.target.setAttribute("value", value);
            this._formData = {
                ...this._formData,
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

        const inputList = this._parentNode.querySelectorAll("input");
        if (inputList && inputList.length && !this._inputCallback) {
            this._inputCallback = true;
            inputList.forEach((input) => {
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

        this._parentNode.querySelectorAll("input").forEach((input) => {
            input.removeEventListener("input", this.inputCallback);
        });

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

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        const newErrors = validateProfilePasswordForm(this._formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("password", await transitEncrypt(this._formData.password));

            const accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + AbstractView.userInfo.id,
                "PUT",
                headers,
                formDataToSend
            );

            if (response.ok) {
                this.success = {message: "Changes saved"};
            } else {
                newErrors = await handleResponse(response, this._formData);
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    getHtml() {
        return `
			<div class="d-flex flex-column" id="change-user-info">
				<h4 class="sub-text mb-5 mt-3">
					<b>Edit your information here</b>
				</h4>
				<div class="d-flex flex-column">
					<div class="position-relative">
						<p class="form-error"></p>
					</div>
					<div class="mb-3">
						<input
							id="password"
							type="password"
							class="form-control primary-form extra-form-class"
							style="width: 60%"
							placeholder="password"
							value=""
						/>
					</div>
					<div class="mb-3">
						<input
							id="confirmPassword"
							type="password"
							class="form-control primary-form extra-form-class"
							style="width: 60%"
							placeholder="confirm password"
							value=""
						/>
					</div>
					<div class="mt-3">
						<submit-button
							type="button"
							template="primary-button extra-btn-class"
							style="width: 140px"
							value="Save changes"
						>
						</submit-button>	
					</div>
				</div>
			</div>
        `;
    }
}
