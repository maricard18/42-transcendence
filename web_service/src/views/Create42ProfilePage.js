import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { transitEncrypt } from "../functions/vaultAccess";
import getUserInfo from "../functions/getUserInfo";
import { getToken } from "../functions/tokens";

export default class Create42ProfilePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create 42 Profile");
		this._callback = false;
        this._insideRequest = false;
        this._inputCallback = false;
        this._avatarCallback = false;
        this._clickCallback = false;
        this._removeCallback = false;
        this._enterCallback = false;

		this._username = "";
		this._avatar = null;
        this._errors = {};

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		this.removeCallbacksBound = this.removeCallbacks.bind(this);
		window.addEventListener("popstate", this.removeCallbacksBound);
    }

	inputCallback = (event, input) => {
		const value = event.target.value;
		input.setAttribute("value", value);
		this._username = value;
	};

	avatarCallback = (event) => {
		this._avatar = event.detail;
	};

	buttonClickedCallback = () => {
		this.handleValidation();
	};

	removeAvatarCallback = (event) => {
		event.target.dispatchEvent(new CustomEvent("remove-avatar"));
		this._avatar = null;
		this._removeCallback = false;
	}

	keydownCallback = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			this.handleValidation();
		}
	};

    async defineCallback() {
        const parentNode = document.getElementById("create-42profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

		if (!this._callback) {
			this._callback = true;
			const userData = await getUserInfo();

            if (userData) {
                AbstractView.userInfo = {
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    id: userData.id,
                };
            } else {
				console.error("Error: failed to fetch user data");
            }

			this.loadDOMChanges();
		}

        const inputList = this._parentNode.querySelectorAll("input");
        const input = inputList[inputList.length - 1];
        if (input && !this._inputCallback) {
            this._inputCallback = true;
            input.addEventListener("input", (event) => this.inputCallback(event, input));
        }

		const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox && !this._avatarCallback) {
            this._avatarCallback = true;
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener("buttonClicked", this.buttonClickedCallback);
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
            submitButton.removeEventListener("buttonClicked", this.buttonClickedCallback);
        }

		const removeButton = this._parentNode.querySelector("#remove-avatar");
        if (removeButton && !this._removeCallback) {
            this._removeCallback = true;
            removeButton.removeEventListener("click", this.removeAvatarCallback);
        }

        window.removeEventListener("keydown", this.keydownCallback);
		window.removeEventListener("popstate", this.removeCallbacksBound);

        this._observer.disconnect();
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this._errors.message) {
            const p = this._parentNode.querySelector("p");
            p.innerText = this._errors.message;

            const input = this._parentNode.querySelector("input");
            if (this._errors.username) {
                input.classList.add("input-error");
                this._username = input.value;
				setTimeout(() => {
					input.classList.remove("input-error");
				}, 3000);
            } else if (input.classList.contains("input-error")) {
                input.classList.remove("input-error");
            }

			setTimeout(() => {
				p.innerText = "";
			}, 3000);
        }
    }

    async handleValidation() {
		if (this._insideRequest) {
			return ;
		}

		this._insideRequest = true;
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

        if (this._username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            this._username = "";
            this.errors = newErrors;
        } else if (this._username.length < 3 ||
            this._username.length > 12) {
            newErrors.message = "Username must have 3-12 characters";
            newErrors.username = 1;
            this._username = "";
            this.errors = newErrors;
        } else if (!usernamePattern.test(this._username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            this._username = "";
            this.errors = newErrors;
        }

        if (!newErrors.message) {
			const formDataToSend = new FormData();
            formDataToSend.append("username", await transitEncrypt(this._username));

            if (this._avatar) {
                formDataToSend.append("avatar", this.avatar);
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
                AbstractView.userInfo.username = this._username;
				if (this._avatar) {
					AbstractView.userInfo.avatar = this._avatar;
				}

				this.removeCallbacks();
				localStorage.setItem("previous_location", location.pathname);
				navigateTo("/home");
            } else {
				if (response.status === 409) {
					newErrors.message = "This username already exists";
				} else {
					newErrors.message = "Internal Server Error"
				}
                
				this.errors = newErrors;
            }
        }

		this._insideRequest = false;
    };

	async loadDOMChanges() {
        const parentNode = document.getElementById("create-42profile-page");
        parentNode.innerHTML = this.loadCreat42ProfilePageContent();
    }

    loadCreat42ProfilePageContent() {
        return `
			<div class="container" id="create-42profile-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<div class="mb-5">
						${
							AbstractView.userInfo.avatar
								? `<img
										id="nav-bar-avatar"
										class="white-border-lg"
										src="${AbstractView.userInfo.avatar}"
										alt="avatar"
										width="200"
										height="200"
										style="border-radius: 50%"
									/>`
								: `<avatar-box></base-avatar>`
						}
						</div>
						<div class="position-relative">
							<p class="form-error"></p>
						</div>
						<div class="mb-3">
							<input
								id="username"
								type="username"
								class="form-control primary-form extra-form-class"
								placeholder="username"
								value=""
							/>
						</div>
						<div>
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

	async getHtml() {
		return `
			<div class="container-fluid" id="create-42profile-page">
				<loading-icon template="center" size="5rem"></loading-icon>
			</div>
		`;
    }
}
