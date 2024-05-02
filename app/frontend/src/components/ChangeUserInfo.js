import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { validateProfileUserForm } from "../functions/validateForms";
import { getToken } from "../functions/tokens";
import { transitEncrypt } from "../functions/vaultAccess";

export default class ChangeUserInfo extends AbstractView {
    constructor() {
        super();
        this._loading = true;
        this._parentNode = null;
        this._insideRequest = false;
        this._inputCallback = false;
        this._clickCallback = false;
        this._usernameButton = false;
		this._emailButton = false;

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
            this.handleValidation(event.target.id);
        };

        const inputList = this._parentNode.querySelectorAll("input");
		if (inputList && inputList.length && !this._inputCallback) {
			this._inputCallback = true;
			this._parentNode.querySelectorAll("input").forEach((input) => {
				input.addEventListener("input", this.inputCallback);
			});
		}

        const usernameButton = document.getElementById("username-btn");
        if (usernameButton && !this._usernameButton) {
            this._usernameButton = true;
            usernameButton.addEventListener("click", this.buttonClickedCallback);
        }

		const emailButton = document.getElementById("email-btn");
        if (emailButton && !this._emailButton) {
            this._emailButton = true;
            emailButton.addEventListener("click", this.buttonClickedCallback);
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

		const usernameButton = document.getElementById("username-btn");
        if (usernameButton) {
            usernameButton.removeEventListener("click", this.buttonClickedCallback);
        }

		const emailButton = document.getElementById("email-btn");
        if (emailButton) {
            emailButton.removeEventListener("click", this.buttonClickedCallback);
        }

        this._inputCallback = false;
        this._clickCallback = false;
        this._usernameButton = false;
		this._emailButton = false;
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

			const usernameDiv = document.getElementById("username-div");
			const usernameInput = document.getElementById("username");
			if (this.errors["username"]) {
				usernameDiv.classList.add("input-btn-error");
				this._formData["username"] = usernameInput.value;
			} else if (usernameDiv.classList.contains("input-btn-error")) {
				usernameDiv.classList.remove("input-btn-error");
			}
			
			const emailDiv = document.getElementById("email-div");
			const emailInput = document.getElementById("email");
			if (this.errors["email"]) {
				emailDiv.classList.add("input-btn-error");
				this._formData["email"] = emailInput.value;
			} else if (emailDiv.classList.contains("input-btn-error")) {
				emailDiv.classList.remove("input-btn-error");
			}
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

			const usernameDiv = document.getElementById("username-div");
			if (usernameDiv.classList.contains("input-btn-error")) {
				usernameDiv.classList.remove("input-btn-error");
			}
			const emailDiv = document.getElementById("email-div");
			if (emailDiv.classList.contains("input-btn-error")) {
				emailDiv.classList.remove("input-btn-error");
			}

			setTimeout(() => { p.innerText = "" }, 3000);
        }
    }

    async handleValidation(id) {
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

            if (id === "username-btn" && this._formData.username !== AbstractView.userInfo.username) {
                formDataToSend.append("username", await transitEncrypt(this._formData.username));
            }
            if (id === "email-btn" && this._formData.email !== AbstractView.userInfo.email) {
                formDataToSend.append("email", await transitEncrypt(this._formData.email));
            }

            let size = 0;
            for (let pair of formDataToSend.entries()) {
                size++;
            }

            if (!size) {
                this._insideRequest = false;
                const p = this._parentNode.querySelector("p");
                p.innerText = "";
				const usernameDiv = document.getElementById("username-div");
				if (usernameDiv.classList.contains("input-btn-error")) {
					usernameDiv.classList.remove("input-btn-error");
				}
				const emailDiv = document.getElementById("email-div");
				if (emailDiv.classList.contains("input-btn-error")) {
					emailDiv.classList.remove("input-btn-error");
				}
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
			parentNode.classList.remove("justify-content-center");
        }
		
		parentNode.innerHTML = this.loadChangeUserInfoContent();
    }

    loadChangeUserInfoContent() {
		return `
			<div class="d-flex flex-row justify-content-center">
				<div class="d-flex flex-column w-100">
					<h4 class="sub-text mb-5 mt-2">
						<b>Edit your information here</b>
					</h4>
					<div class="position-relative">
						<p class="form-error"></p>
						<div class="input-group mb-3 input-btn" style="width: 70%" id="username-div">
							<input
								id="username"
								type="text" 
								class="form-control primary-form extra-form-class"
								placeholder="username" 
								aria-label="Recipient's username" 
								aria-describedby="button-addon2"
								value="${AbstractView.userInfo.username}"
							/>
							<button 
								class="btn btn-outline-secondary primary-button extra-btn-class"
								style="width: 130px"
								type="button" 
								id="username-btn"
							>
								Save Changes
							</button>
						</div>
						<div class="input-group mb-3 input-btn"  style="width: 70%" id="email-div">
							<input
								id="email"
								type="text" 
								class="form-control primary-form extra-form-class"
								placeholder="username" 
								aria-label="Recipient's username" 
								aria-describedby="button-addon2"
								value="${AbstractView.userInfo.email}"
							/>
							<button 
								class="btn btn-outline-secondary primary-button extra-btn-class"
								style="width: 130px"
								type="button" 
								id="email-btn"
							>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="d-flex flex-row justify-content-center">
				<div class="d-flex flex-column mt-3">
					<qr-code
						id="qr1"
						contents="https://bitjson.com/"
						module-color="#1c7d43"
						position-ring-color="#13532d"
						position-center-color="#70c559"
						mask-x-to-y-ratio="1.2"
						style="
						width: 100px;
						height: 100px;
						margin: 2em auto;
						background-color: #fff;
						"
					></qr-code>
				</div>
			</div>
        `;
	}

    getHtml() {
        if (this._loading) {
            return `
				<div class="d-flex flex-column justify-content-center" id="change-user-info">
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
