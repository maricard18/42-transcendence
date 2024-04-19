import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import handleResponse from "../functions/authenticationErrors";
import { navigateTo } from "../index";
import { createToken } from "../functions/tokens";

export default class CreateProfilePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Profile");
        this._loading = true;
        this._callbacksDefined = false;
        this._insideRequest = false;
        this._errors = {};
        this._avatar = null;

        if (Object.values(AbstractView.formData).every((value) => value === "")) {
            setTimeout(() => {
                navigateTo("/sign-up");
            }, 0);
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

        this.avatarCallback = (event) => {
            this._avatar = event.detail;
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

        const inputList = document.querySelectorAll("input");
		const input = inputList[inputList.length - 1];
        if (input) {
            input.addEventListener("input", (event) =>
                this.inputCallback(event, input)
            );
        }

        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

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
        const input = document.querySelector("input").lastChild;
        if (input) {
            input.removeEventListener("input", this.inputCallback);
        }

        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.removeEventListener("avatar-change", this.inputCallback);
        }

        const submitButton = document.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        window.removeEventListener("keydown", this.keydownCallback);

        this.disconnectObserver();
    }

    disconnectObserver() {
        this._observer.disconnect();
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

        if (this.errors.message) {
            const p = document.querySelector("p");
            p.innerText = this.errors.message;

            const inputList = document.querySelectorAll("input");
			const input = inputList[inputList.length - 1];
			console.log(input)
			const id = input.getAttribute("id");
			if (this.errors[id]) {
				input.classList.add("input-error");
				input.setAttribute("value", "");
				input.value = "";
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

        if (this.formData.username === "") {
            newErrors.message = "Please fill in all required fields";
            newErrors.username = 1;
            this.formData.username = "";
            this.errors = newErrors;
        } else if (
            this.formData.username.length < 3 ||
            this.formData.username.length > 12
        ) {
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

        if (!newErrors.message) {
            const formDataToSend = new FormData();
            formDataToSend.append("username", this.formData.username);
            formDataToSend.append("email", this.formData.email);
            formDataToSend.append("password", this.formData.password);

            if (this._avatar) {
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
                console.log("user created!");
                await createToken(this.formData, AbstractView.authed);
				const data = await response.json();
                this.userInfo = {
                    username: this.formData.username,
                    email: this.formData.email,
                    avatar: this._avatar
                        ? URL.createObjectURL(this._avatar)
                        : null,
                    id: data["id"],
                };
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
