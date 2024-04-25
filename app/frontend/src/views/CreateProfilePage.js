import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { createToken } from "../functions/tokens";

export default class CreateProfilePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Profile");
        this._insideRequest = false;
        this._inputCallback = false;
        this._avatarCallback = false;
        this._clickCallback = false;
		this._removeCallback = false;
        this._enterCallback = false;

        this._errors = {};
        this._avatar = null;

		if (Object.values(AbstractView.formData).every((value) => value === "")) {
            setTimeout(() => {
                navigateTo("/sign-up");
            }, 5);
            return;
        }

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
        const parentNode = document.getElementById("create-profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.inputCallback = (event, input) => {
            const id = input.getAttribute("id");
            const value = event.target.value;
            input.setAttribute("value", value);
            AbstractView.formData[id] = value;
        };

        this.avatarCallback = (event) => {
            this._avatar = event.detail;
        };

        this.buttonClickedCallback = () => {
            this.handleValidation();
        };

		this.removeAvatarCallback = (event) => {
			event.target.dispatchEvent(new CustomEvent("remove-avatar"));
			this.avatar = null;
			this._removeCallback = false;
		}

        this.keydownCallback = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.handleValidation();
            }
        };

        const inputList = this._parentNode.querySelectorAll("input");
        const input = inputList[inputList.length - 1];
        if (input && !this._inputCallback) {
            this._inputCallback = true;
            input.addEventListener("input", (event) =>
                this.inputCallback(event, input)
            );
        }

        const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox && !this._avatarCallback) {
            this._avatarCallback = true;
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

		const removeButton = this._parentNode.querySelector("#remove-avatar");
		if (removeButton && !this._removeCallback) {
			this._removeCallback = true;
			removeButton.addEventListener("click", this.removeAvatarCallback);
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
        const input = inputList[inputList.length - 1];
        if (input) {
            input.removeEventListener("input", this.inputCallback);
        }

        const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.removeEventListener("avatar-change", this.inputCallback);
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

		const removeButton = this._parentNode.querySelector("#remove-avatar");
		if (removeButton && !this._removeCallback) {
			this._removeCallback = true;
			removeButton.removeEventListener("click", this.removeAvatarCallback);
		}

        window.removeEventListener("keydown", this.keydownCallback);

        this._inputCallback = false;
        this._avatarCallback = false;
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
            const input = inputList[inputList.length - 1];
            const id = input.getAttribute("id");
            if (this.errors[id]) {
                input.classList.add("input-error");
                AbstractView.formData[id] = input.value;
            } else if (input.classList.contains("input-error")) {
                input.classList.remove("input-error");
            }
        }
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

        if (AbstractView.formData.username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            this.errors = newErrors;
        } else if (
            AbstractView.formData.username.length < 3 ||
            AbstractView.formData.username.length > 12) {
            newErrors.message = "Username must have 3-12 characters";
            newErrors.username = 1;
            this.errors = newErrors;
        } else if (!usernamePattern.test(AbstractView.formData.username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            this.errors = newErrors;
        }

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("username", AbstractView.formData.username);
            formDataToSend.append("email", AbstractView.formData.email);
            formDataToSend.append("password", AbstractView.formData.password);

            if (this._avatar) {
                formDataToSend.append("avatar", this.avatar);
            }

            const response = await fetchData(
                "/api/users",
                "POST",
                null,
                formDataToSend
            );

            if (response.ok) {
                await createToken(AbstractView.formData);
                const data = await response.json();
                AbstractView.userInfo = {
                    username: AbstractView.formData.username,
                    email: AbstractView.formData.email,
                    avatar: this._avatar
                        ? URL.createObjectURL(this._avatar)
                        : null,
                    id: data["id"],
                };
                this.removeCallbacks();
                navigateTo("/home");
            } else {
                newErrors = await handleResponse(
                    response,
                    AbstractView.formData
                );
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    async getHtml() {
        return `
			<div class="container" id="create-profile-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
							<avatar-box></avatar-box>
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
