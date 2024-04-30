import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { validateProfileUserForm } from "../functions/validateForms";
import { getToken } from "../functions/tokens";

export default class ChangeUserInfo extends AbstractView {
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
            username: AbstractView.userInfo.username,
            email: AbstractView.userInfo.email,
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
            this._formData[id] = value;
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

        if (AbstractView.userInfo.username &&
            AbstractView.userInfo.email &&
            this._loading) {
            this._loading = false;
            this._formData.username = AbstractView.userInfo.username;
            this._formData.email = AbstractView.userInfo.email;
            this.loadDOMChanges();
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

			setTimeout(() => { p.innerText = "" }, 3000);
        }
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        let newErrors = validateProfileUserForm(this._formData);
        if (Object.values(newErrors).length !== 0) {
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            const formDataToSend = new FormData();

            if (this._formData.username !== AbstractView.userInfo.username) {
                formDataToSend.append("username", this._formData.username);
            }
            if (this._formData.email !== AbstractView.userInfo.email) {
                formDataToSend.append("email", this._formData.email);
            }

            let size = 0;
            for (let pair of formDataToSend.entries()) {
                size++;
            }

            if (!size) {
                this._insideRequest = false;
                const p = this._parentNode.querySelector("p");
                p.innerText = "";
                const inputList = this._parentNode.querySelectorAll("input");
                inputList.forEach((input) => {
                    if (input.classList.contains("input-error")) {
                        input.classList.remove("input-error");
                    }
                });
                return;
            }

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
                AbstractView.userInfo.username = this._formData.username;
                AbstractView.userInfo.email = this._formData.email;
                const avatarContainer = document.getElementById("avatar-container");
                avatarContainer.dispatchEvent(
                    new CustomEvent("avatar-container")
                );
                this.success = { message: "Changes saved" };
            } else {
                newErrors = await handleResponse(response, this._formData);
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("change-user-info");
        const loadingIcon = parentNode.querySelector("loading-icon");
        if (loadingIcon) {
            loadingIcon.remove();
        }
		
		parentNode.innerHTML = this.loadChangeUserInfoContent();
    }

    loadChangeUserInfoContent() {
        return `
			<h4 class="sub-text mb-5">
				<b>Edit your information here</b>
			</h4>
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
							value="${AbstractView.userInfo.username}"
						/>
					</div>
					<div class="mb-3">
						<input
							id="email"
							type="email"
							class="form-control primary-form"
							placeholder="email"
							value="${AbstractView.userInfo.email}"
						/>
					</div>
					<div class="mt-3">
						<submit-button
							type="button"
							template="primary-button extra-btn-class"
							value="Save changes"
						>
						</submit-button>	
					</div>
				</form>
			</div>
			`;
    }

    getHtml() {
        if (this._loading) {
            return `
				<div class="d-flex flex-column" id="change-user-info">
					<loading-icon template="center" size="5rem"></loading-icon>
				</div>
			`;
        } else {
            return `
				<div class="d-flex flex-column" id="change-user-info">
					${this.loadChangeUserInfoContent()}
				</div>
			`;
        }
    }
}
