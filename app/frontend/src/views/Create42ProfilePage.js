import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { createToken } from "../functions/tokens";

export default class Create42ProfilePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Profile");
        this._loading = true;
		this._callbacksRemoved = true;
		this._insideRequest = false;
        this._errors = {};
		this._avatar = null;
		
		if (Object.values(AbstractView.formData).every((value) => value === "")) {
			setTimeout(() => {
				navigateTo("/sign-up");
			}, 0);
			return ;
		}
        
		this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		window.onbeforeunload = () => {
			this.removeCallbacks();
			this.disconnectObserver();
		};
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;
    }

	get avatar() {
		return this._avatar;
	}

	set avatar(value) {
		this._avatar = value;
	}

	async handleValidation() {
		if (this._insideRequest) {
			return ;
		}

		this._insideRequest = true;
        const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

        if (AbstractView.formData.username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            AbstractView.formData.username = "";
            this.errors = newErrors;
        } else if (AbstractView.formData.username.length < 3 ||
            	AbstractView.formData.username.length > 12) {
            newErrors.message = "Username must have 3-12 characters";
            newErrors.username = 1;
            AbstractView.formData.username = "";
            this.errors = newErrors;
        } else if (!usernamePattern.test(AbstractView.formData.username)) {
            newErrors.message = "Username has invalid characters";
            newErrors.username = 1;
            AbstractView.formData.username = "";
            this.errors = newErrors;
        }

		const inputBox = document.querySelector("input");
        inputBox.setAttribute(
			"value",
			AbstractView.formData["username"]
		);

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("username", AbstractView.formData.username);
            formDataToSend.append("email", AbstractView.formData.email);
            formDataToSend.append("password", AbstractView.formData.password);

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
                await createToken(AbstractView.formData);
                AbstractView.userInfo = {
                    username: AbstractView.formData.username,
                    email: AbstractView.formData.email,
                    avatar: this.avatar ? URL.createObjectURL(this.avatar) : null,
                    id: null,
                };
				this.removeCallbacks();
				this.disconnectObserver();
                navigateTo("/home");
            } else {
                newErrors = await handleResponse(response, AbstractView.formData);
                this.errors = newErrors;
				this.render();
            }
        } else {
			this.render();
		}

		this._insideRequest = false;
    };

	defineCallback() {
		if (!this._callbacksRemoved) {
			return ;
		}

		this.inputChangedCallback = (event) => {
			AbstractView.formData.username = event.detail.value;
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
                                        value="${AbstractView.formData.username}"
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
