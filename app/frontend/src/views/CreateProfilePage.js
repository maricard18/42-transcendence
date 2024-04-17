import AbstractView from "./AbstractView.js";
import fetchData from "../functions/fetchData.js";
import handleResponse from "../functions/authenticationErrors.js";
import { navigateTo } from "../index.js";
import { createToken } from "../functions/tokens.js";

export default class CreateProfilePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Profile");
        this._loading = true;
		this._callbacksRemoved = true;
        this._errors = {};
		this._avatar = null;
		console.log(AbstractView.formData)
		
		if (Object.values(AbstractView.formData).every((value) => value === "")) {
			navigateTo("/sign-up");
			return ;
		}
        
		this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		window.onbeforeunload = () => {
			this.removeCallbacks();
			this.disconnectObserver()
		};
    }

    get formData() {
        return AbstractView.formData;
    }

    set formData(value) {
        AbstractView.formData = value;
    }

	get userInfo() {
        return AbstractView.userInfo;
    }

    set userInfo(value) {
        AbstractView.userInfo = value;
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;
        this.render();
    }

	get avatar() {
		return this._avatar;
	}

	set avatar(value) {
		this._avatar = value;
	}

	async handleValidation() {
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

        if (this.formData.username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            this.formData.username = "";
            this.errors = newErrors;
        } else if (this.formData.username.length < 3 ||
            	this.formData.username.length > 12) {
            newErrors.message = "Username must have 3-12 characters";
            newErrors.username = 1;
            this.formData.username = "";
            this.errors = newErrors;
        } else if (!usernamePattern.test(this.formData.username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            this.formData.username = "";
            this.errors = newErrors;
        }

		const inputBox = document.querySelector("input");
        inputBox.setAttribute(
			"value",
			this.formData["username"]
		);

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("username", this.formData.username);
            formDataToSend.append("email", this.formData.email);
            formDataToSend.append("password", this.formData.password);

            if (this.avatar) {
                formDataToSend.append("avatar", this.avatar);
            }

			console.log("DataToBeSent:", formDataToSend);

            const response = await fetchData(
                "/api/users",
                "POST",
                null,
                formDataToSend
            );

            if (response.ok) {
				console.log("user created!")
                await createToken(this.formData, this.authed);
                this.userInfo = {
                    username: this.formData.username,
                    email: this.formData.email,
                    avatar: this.avatar ? URL.createObjectURL(this.avatar) : null,
                    id: null,
                };
				this.removeCallbacks();
				this.disconnectObserver();
                navigateTo("/home");
            } else {
                newErrors = await handleResponse(response, this.formData);
                this.errors = newErrors;
            }
        }
    };

	defineCallback() {
		if (!this._callbacksRemoved) {
			return ;
		}

		this.inputChangedCallback = (event) => {
			this.formData.username = event.detail.value;
		};
		this.avatarChangedCallback = (event) => {
			this.avatar = event.detail;
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
	
		const inputBox = document.querySelector("input-box");
		if (inputBox) {
			inputBox.addEventListener("inputChanged", this.inputChangedCallback);
		};
		const avatarBox = document.querySelector("avatar-box");
		if (avatarBox) {
			avatarBox.addEventListener("avatarChanged", this.avatarChangedCallback)
		}
		const submitButton = document.querySelector("submit-button");
		if (submitButton) {
			submitButton.addEventListener("buttonClicked", this.buttonClickedCallback);
		}
		window.addEventListener("keydown", this.keydownCallback);
		this._callbacksRemoved = false;
	}

	removeCallbacks() {
		const inputBox = document.querySelector("input-box");
		if (inputBox) {
			inputBox.removeEventListener("inputChanged", this.inputChangedCallback);
		};

		const avatarBox = document.querySelector("avatar-box");
		if (avatarBox) {
			avatarBox.removeEventListener("avatarChanged", this.inputChangedCallback);
		}
	
		const submitButton = document.querySelector("submit-button");
		if (submitButton) {
			submitButton.removeEventListener("buttonClicked", this.buttonClickedCallback);
		}
	
		window.removeEventListener("keydown", this.keydownCallback);
		this._callbacksRemoved = true;
	}

	disconnectObserver() {
		this.observer.disconnect();
	}

    async render() {
		this.removeCallbacks();

        const element = document.querySelector("#create-profile-page");
		if (element) {
			element.innerHTML = await this.getHtml();
		}
    }

    async getHtml() {
        return `
			<div class="container" id="create-profile-page">
				<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<form>
							<div class="mb-5">
							${this.avatar ? 
								`<avatar-box avatar="${URL.createObjectURL(this.avatar)}"></avatar-box>`
								: `<avatar-box></avatar-box>`
							}
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
								<div class="mt-3">
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
