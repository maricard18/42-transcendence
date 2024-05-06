import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import {validateProfileUserForm} from "../functions/validateForms";
import {getToken} from "../functions/tokens";
import {transitEncrypt} from "../functions/vaultAccess";

export default class ChangeUserInfo extends AbstractView {
    constructor() {
        super();
        this._loading = true;
		this._loadingUserOtp = true;
        this._parentNode = null;
        this._insideRequest = false;
        this._inputCallback = false;
		this._2FAInputCallback = false;
        this._clickCallback = false;
        this._usernameButton = false;
		this._emailButton = false;
		this._setup2FAButton = false;
		this._remove2FAButton = false;
		this._has2FA = true;
		this._qrcode = null;

        this._errors = {};
        this._success = {};
		this._2FACode = null;
        this._formData = {
            username: AbstractView.userInfo.username,
            email: AbstractView.userInfo.email,
        };

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    async defineCallback() {
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

		this.twofaInputCallback = (event) => {
            const value = event.target.value;
            event.target.setAttribute("value", value);
            this._2FACode = value;
        };

        this.buttonClickedCallback = (event) => {
            this.handleValidation(event.target.id);
        };

		this.setup2FACallback = async () => {
			this._accessToken = await getToken();
			const headers = {
				Authorization: `Bearer ${this._accessToken}`,
			};

			const response = await fetchData(
				"/api/users/" + AbstractView.userInfo.id + "/otp",
				"POST",
				headers,
				null
			);

			if (response.ok) {
				const jsonData = await response.json();
				this._qrcode = jsonData["url"];
				this.updateModalBodyContent();
			} else {
				console.error("Error: POST request to otp failed");
				this._has2FA = false;
			}
		}

		this.validate2FACallback = async () => {
			this._accessToken = await getToken();
			const headers = {
				Authorization: `Bearer ${this._accessToken}`,
			};

			const response = await fetchData(
				"/api/users/" + AbstractView.userInfo.id + "/otp?code=" + this._2FACode,
				"GET",
				headers,
				null
			);

			if (response.ok) {
				const p = document.getElementById("p-2FA");
				const jsonData = await response.json();
				if (jsonData["valid"] === "true") {
					this._has2FA = true;
					if (p.classList.contains("form-error")) {
						p.classList.remove("form-error");
					}
					p.classList.add("form-success");
					p.style.whiteSpace = "nowrap";
					p.style.display = "flex";
					p.style.justifyContent = "center";
					p.innerText = "2FA activated successufly";
					console.log("otp code is correct");
					//! load <REMOVE 2FA BUTTON>
				} else {
					if (p.classList.contains("form-success")) {
						p.classList.remove("form-success");
					}
					p.classList.add("form-error");
					p.style.whiteSpace = "nowrap";
					p.style.display = "flex";
					p.style.justifyContent = "center";
					p.innerText = "2FA code is invalid";
					console.error("otp code is incorrect");
				}
			} else {
				console.error("Error: POST request to otp failed");
				this._has2FA = false;
			}
		}

		this.remove2FACallback = async () => {
			this._accessToken = await getToken();
			const headers = {
				Authorization: `Bearer ${this._accessToken}`,
			};

			const response = await fetchData(
				"/api/users/" + AbstractView.userInfo.id + "/otp",
				"DELETE",
				headers,
				null
			);

			if (response.ok) {
				console.log("otp was deleted!")
				this._has2FA = false;
				this._qrcode = null;
			} else {
				console.error("Error: DELETE request to otp failed");
				this._has2FA = false;
			}
		}

        const inputList = this._parentNode.querySelectorAll("input");
        if (inputList && inputList.length && !this._inputCallback) {
            this._inputCallback = true;
            this._parentNode.querySelectorAll("input").forEach((input) => {
                input.addEventListener("input", this.inputCallback);
            });
        }

		const twofaInput = document.getElementById("input-2FA");
        if (twofaInput && !this._2FAInputCallback) {
            this._2FAInputCallback = true;
            twofaInput.addEventListener("input", this.twofaInputCallback);
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

		const setup2FAButton = document.getElementById("setup-2FA");
		if (setup2FAButton && !this._setup2FAButton) {
			this._setup2FAButton = true;
			setup2FAButton.addEventListener("click", this.setup2FACallback);
		}

		const validate2FAButton = document.getElementById("validate-2FA");
		if (validate2FAButton && !this._validate2FAButton) {
			this._validate2FAButton = true;
			validate2FAButton.addEventListener("click", this.validate2FACallback);
		}

		const remove2FAButton = document.getElementById("remove-2FA");
		if (remove2FAButton && !this.remove2FAButton) {
			this.remove2FAButton = true;
			remove2FAButton.addEventListener("click", this.remove2FACallback);
		}

        if (AbstractView.userInfo.username &&
            AbstractView.userInfo.email &&
            this._loading) {
            this._loading = false;
            this._formData.username = AbstractView.userInfo.username;
            this._formData.email = AbstractView.userInfo.email;

			this._accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${this._accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + AbstractView.userInfo.id + "/otp",
                "GET",
                headers,
                null
            );

            if (response.ok) {
                const jsonData = await response.json();
				if (jsonData["active"] === "true") {
					this._has2FA = true;
				} else {
					this.remove2FACallback();
				}
            } else {
                console.error("Error: user does not have otp");
				this._has2FA = false;
            }

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

        if (this._errors.message) {
            const p = this._parentNode.querySelector("p");
            if (p.classList.contains("form-success")) {
                p.classList.remove("form-success");
            }
            p.classList.add("form-error");
            p.innerText = this._errors.message;
			p.style.whiteSpace = "nowrap";
			p.style.display = "flex";
			p.style.justifyContent = "center";

			const usernameDiv = document.getElementById("username-div");
			const usernameInput = document.getElementById("username");
			if (this._errors["username"]) {
				usernameDiv.classList.add("input-btn-error");
				this._formData["username"] = usernameInput.value;
			} else if (usernameDiv.classList.contains("input-btn-error")) {
				usernameDiv.classList.remove("input-btn-error");
			}
			
			const emailDiv = document.getElementById("email-div");
			const emailInput = document.getElementById("email");
			if (this._errors["email"]) {
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
			p.style.whiteSpace = "nowrap";
			p.style.display = "flex";
			p.style.justifyContent = "center";

			const usernameDiv = document.getElementById("username-div");
			if (usernameDiv.classList.contains("input-btn-error")) {
				usernameDiv.classList.remove("input-btn-error");
			}
			const emailDiv = document.getElementById("email-div");
			if (emailDiv.classList.contains("input-btn-error")) {
				emailDiv.classList.remove("input-btn-error");
			}

            setTimeout(() => {
                p.innerText = ""
            }, 3000);
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

			this._accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${this._accessToken}`,
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
                this.success = {message: "Changes saved"};
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

	updateModalBodyContent() {
		const modalBody = document.getElementById("modal-body");
		modalBody.innerHTML = `<qr-code
									id="qr1"
									contents="${this._qrcode}"
									module-color="#8259c5"
									position-ring-color="#3e0d8e"
									position-center-color="#583296"
									mask-x-to-y-ratio="1.2"
									style="width: 30%; height: 30%; margin: 2em auto; background-color: #fff; border-radius: 10px"
								></qr-code>
								<div class="position-relative mt-4">
									<p class="form-error" id="p-2FA"></p>
								</div>
								<div class="input-group input-btn mb-3" style="width: 45%" id="otp-div">
									<input
										id="input-2FA"
										type="text" 
										class="form-control primary-form extra-form-class"
										placeholder="code" 
										aria-label="Recipient's username" 
										aria-describedby="button-addon2"
										value=""
									/>
									<button 
										class="btn btn-outline-secondary primary-button extra-btn-class"
										style="width: 100px"
										type="button" 
										id="validate-2FA"
									>
										Validate
									</button>
								</div>`;
	}

    loadChangeUserInfoContent() {
		return `
			<div class="d-flex flex-row justify-content-center">
				<div class="d-flex flex-column align-items-center w-100">
					<h4 class="sub-text mb-5 mt-3">
						<b>Edit your information here</b>
					</h4>
					<div class="position-relative">
						<p class="form-error"></p>
					</div>
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
							style="width: 70px"
							type="button" 
							id="username-btn"
						>
							Save
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
							style="width: 70px"
							type="button" 
							id="email-btn"
						>
							Save
						</button>
					</div>
				</div>
			</div>
			<div class="d-flex flex-row justify-content-center">
				<div class="d-flex flex-column align-items-center">
					<h4 class="sub-text mb-3 mt-5">
						<b>Two-Factor Authentication</b>
					</h4>
					<div class="mt-3" id="2FA">
					${
						this._has2FA
							? `<button 
									type="button" 
									id="remove-2FA"
									class="btn btn-primary red-button extra-btn-class"
									style="width: 140px"
								>
									Remove 2FA
								</button>`
							: `	<button 
									type="button"
									id="setup-2FA"
									class="btn btn-primary primary-button extra-btn-class"
									style="width: 140px"
									data-bs-toggle="modal"
									data-bs-target="#2FAModal"
								>
									Setup 2FA
								</button>
							
								<div
									class="modal fade"
									id="2FAModal"
									tabindex="-1"
									aria-labelledby="2FAModalLabel" 
									aria-hidden="true"
								>
									<div class="modal-dialog modal-dialog-centered">
										<div class="modal-content bg-dark text-white">
											<div class="modal-header">
												<h1 class="modal-title fs-5" id="2FAModalLabel">Two-Factor Authentication</h1>
												<button 
													type="button" 
													class="btn-close" 
													data-bs-dismiss="modal" 
													aria-label="Close"
												></button>
											</div>
											<div class="modal-body">
												<div class="d-flex flex-column align-items-center" id="modal-body">
													<loading-icon size="3rem"></loading-icon>
												</div>
											</div>
										</div>
									</div>
								</div>`
					}
					</div>
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
