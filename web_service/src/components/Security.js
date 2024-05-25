import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { getToken } from "../functions/tokens";
import { transitEncrypt } from "../functions/vaultAccess";
import { validate2FAForm, validateProfilePasswordForm } from "../functions/validateForms";

export default class Security extends AbstractView {
    constructor() {
        super();
        this._loading = true;
        this._parentNode = null;
        this._insideRequest = false;

        this._inputCallback = false;
        this._clickCallback = false;
        this._2FACallback = false;
        this._setup2FAButton = false;
        this._remove2FAButton = false;

        this._2FACode = null;
        this._qrcode = null;
        this._errors = {};
        this._success = {};
        this._formData = {
            password: "",
            confirmPassword: "",
        };

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
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

            const inputList = this._parentNode.querySelectorAll("input");
            inputList.forEach((input) => {
                const id = input.getAttribute("id");
                if (this._errors[id]) {
                    input.classList.add("input-error");
                    this._formData[id] = input.value;
                    setTimeout(() => {
                        input.classList.remove("input-error");
                    }, 3000);
                } else if (input.classList.contains("input-error")) {
                    input.classList.remove("input-error");
                }
            });

            setTimeout(() => {
                p.innerText = ""
            }, 3000);
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

            setTimeout(() => {
                p.innerText = ""
            }, 3000);
        }
    }

    defineCallback = async () => {
        const parentNode = document.getElementById("security");
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

        this.twofaInputCallback = (event) => {
            const value = event.target.value;
            event.target.setAttribute("value", value);
            this._2FACode = value;
        };

        this.buttonClickedCallback = (event) => {
            this.handleValidation();
        };

        this.setup2FACallback = async () => {
            const accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            if (AbstractView.has2FA === 1) {
                const response = await fetchData(
                    "/api/users/" + AbstractView.userInfo.id + "/otp",
                    "DELETE",
                    headers,
                    null
                );

                if (response && !response.ok) {
                    return;
                }
            }

            const response = await fetchData(
                "/api/users/" + AbstractView.userInfo.id + "/otp",
                "POST",
                headers,
                null
            );

            if (response && response.ok) {
                const jsonData = await response.json();
                this._qrcode = jsonData["url"];
                this.updateModalBodyContent();
                AbstractView.has2FA = 1;

                const validate2FAButton = document.getElementById("validate-2FA");
                if (validate2FAButton) {
                    validate2FAButton.addEventListener("click", this.validate2FACallback);
                }

                const twofaInput = document.getElementById("input-2FA");
                if (twofaInput) {
                    twofaInput.addEventListener("input", this.twofaInputCallback);
                }
            } else {
                AbstractView.has2FA = 0;
            }
        }

        this.validate2FACallback = async () => {
            const newErrors = validate2FAForm(this._2FACode);
            if (newErrors.message) {
                const p = document.getElementById("p-2FA");
                p.innerText = this.errors.message;
                p.classList.add("form-error");
                p.style.whiteSpace = "nowrap";
                p.style.display = "flex";
                p.style.justifyContent = "center";
                p.innerText = newErrors.message;
                setTimeout(() => {
                    p.innerText = "";
                }, 3000);
                return;
            }

            const accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + AbstractView.userInfo.id + "/otp?code=" + this._2FACode + "&activate",
                "GET",
                headers,
                null
            );

            if (response && response.ok) {
                const p = document.getElementById("p-2FA");
                const jsonData = await response.json();
                if (jsonData["valid"] === true) {
                    AbstractView.has2FA = 2;
                    const modalElement = document.getElementById("2FAModal");
                    const backdrop = document.querySelector(".modal-backdrop");
                    if (modalElement) {
                        bootstrap.Modal.getInstance(modalElement).hide();
                    }
                    if (backdrop) {
                        backdrop.remove();
                    }
                    this.loadDOMChanges();
                } else {
                    AbstractView.has2FA = 1;
                    p.classList.add("form-error");
                    p.style.whiteSpace = "nowrap";
                    p.style.display = "flex";
                    p.style.justifyContent = "center";
                    p.innerText = "2FA code is invalid";
                    setTimeout(() => {
                        p.innerText = "";
                    }, 3000);
                }
            } else {
                AbstractView.has2FA = 0;
            }
        }

        this.remove2FACallback = async () => {
            const accessToken = await getToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
                "/api/users/" + AbstractView.userInfo.id + "/otp",
                "DELETE",
                headers,
                null
            );

            if (response && response.ok) {
                AbstractView.has2FA = 0;
                this._qrcode = null;
                this.loadDOMChanges();
            } else {
                AbstractView.has2FA = 1;
            }
        }

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

        const setup2FAButton = this._parentNode.querySelector("#setup-2FA");
        if (setup2FAButton && !this._setup2FAButton) {
            this._setup2FAButton = true;
            setup2FAButton.addEventListener("click", this.setup2FACallback);
        }

        const remove2FAButton = this._parentNode.querySelector("#remove-2FA");
        if (remove2FAButton && !this.remove2FAButton) {
            this.remove2FAButton = true;
            remove2FAButton.addEventListener("click", this.remove2FACallback);
        }

        if (!this._2FACallback) {
            this._2FACallback = true;

            if (AbstractView.has2FA === null) {
                const accessToken = await getToken();
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };

                const response = await fetchData(
                    "/api/users/" + AbstractView.userInfo.id + "/otp",
                    "GET",
                    headers,
                    null
                );

                if (response && response.ok) {
                    const jsonData = await response.json();
                    if (jsonData["active"] === true) {
                        AbstractView.has2FA = 2;
                    } else {
                        AbstractView.has2FA = 1;
                    }
                } else {
                    AbstractView.has2FA = 0;
                }
            }

            this.loadDOMChanges();
        }
    }

    removeCallbacks = () => {
        this._observer.disconnect();

        if (!this._parentNode) {
            return;
        }

        const inputList = this._parentNode.querySelectorAll("input");
        if (inputList) {
            inputList.forEach((input) => {
                input.removeEventListener("input", this.inputCallback);
            });
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }
    }

    async handleValidation() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        let newErrors = validateProfilePasswordForm(this._formData);
        if (Object.values(newErrors).length) {
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

            if (response && response.ok) {
                this.success = {message: "Changes saved"};
            } else {
                newErrors = await handleResponse(response, this._formData);
                this.errors = newErrors;
            }
        }

        this._insideRequest = false;
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("security");
        if (parentNode) {
            parentNode.outerHTML = this.loadSecurityContent();
        }
    }

    updateModalBodyContent() {
        const modalBody = document.getElementById("modal-body");
        if (modalBody) {
            modalBody.innerHTML = `<qr-code
										id="qr1"
										contents="${this._qrcode}"
										module-color="#8259c5"
										position-ring-color="#3e0d8e"
										position-center-color="#583296"
										mask-x-to-y-ratio="1.2"
										style="width: 30%; height: 70%; margin: 2em auto; background-color: #fff; border-radius: 10px"
									></qr-code>
									<div class="position-relative mt-4">
										<p class="form-error" id="p-2FA"></p>
									</div>
									<div class="input-group input-btn mb-3" style="width: 210px" id="otp-div">
										<input
											id="input-2FA"
											type="text" 
											class="form-control primary-form extra-form-class w-25"
											placeholder="6 digit code" 
											aria-label="Recipient's username" 
											aria-describedby="button-addon2"
											value=""
										/>
										<button 
											class="btn btn-outline-secondary primary-button extra-btn-class"
											style="width: 85px"
											type="button" 
											id="validate-2FA"
										>
											Validate
										</button>
									</div>`;
        }
    }

    loadSecurityContent() {
        return `
			<div class="d-flex flex-column justify-content-start h-100" id="security">
				<h4 class="sub-text mb-5 mt-3">
					<b>Edit your passwords here</b>
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
							placeholder="new password"
							value=""
						/>
					</div>
					<div class="mb-3">
						<input
							id="confirmPassword"
							type="password"
							class="form-control primary-form extra-form-class"
							style="width: 60%"
							placeholder="confirm new password"
							value=""
						/>
					</div>
					<div class="mt-1 mb-3">
						<submit-button
							type="button"
							template="primary-button extra-btn-class"
							style="width: 140px"
							value="Save changes"
						>
						</submit-button>	
					</div>
				</div>
				<div class="d-flex flex-row justify-content-center">
					<div class="d-flex flex-column align-items-center">
						<h4 class="sub-text mb-3 mt-5">
							<b>Two-Factor Authentication</b>
						</h4>
						<div class="mt-3" id="2FA">
						${
            AbstractView.has2FA === 2
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
													<h1 class="modal-title fs-5" id="2FAModalTitleLabel">Two-Factor Authentication</h1>
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
			</div>
        `;
    }

    getHtml() {
        return `
			<div class="d-flex flex-column justify-content-center h-100" id="security">
				<loading-icon size="5rem"></loading-icon>
			</div>
		`;
    }
}
