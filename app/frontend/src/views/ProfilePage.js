import AbstractView from "./AbstractView";
import { getToken, logout } from "../functions/tokens";
import fetchData from "../functions/fetchData";
import { navigateTo } from "..";

export default class ProfilePage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._loading = true;
        this._parentNode = null;
        this._avatarCallback = false;
        this._modalCallback = false;
        this._deleteCallback = false;
        this._insideRequest = false;

        this._errors = {};
        this._avatar = AbstractView.userInfo.avatar;

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
        const parentNode = document.getElementById("profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.avatarCallback = (event) => {
            if (!event.detail) {
                const p = this._parentNode.querySelector("p");

                if (p.classList.contains("form-success")) {
                    p.classList.remove("form-success");
                }
                p.classList.add("form-error");
                p.innerText = "Avatar upload failed";
                setTimeout(() => {
                    p.innerText = "";
                }, 3000);
                return;
            }

            this._avatar = event.detail;
            this.changeAvatar();
        };

        this.deleteAccountCallback = async () => {
            console.log("Delete account");
            const accessToken = await getToken();
            const headers = {
            	Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetchData(
            	"/api/users/" + AbstractView.userInfo.id,
            	"DELETE",
            	headers,
            	null
            );

            if (response.ok) {
            	logout();
            	navigateTo("/");
            } else {
            	console.error("Failed to delete user");
            }
        };

        const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox && !this._avatarCallback) {
            this._avatarCallback = true;
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

		const deleteButton = document.getElementById("delete-account-button");
		if (deleteButton && !this._deleteCallback) {
			this._deleteCallback = true;
			deleteButton.addEventListener("click", this.deleteAccountCallback);
		}
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.removeEventListener("avatar-change", this.avatarCallback);
        }

        const deleteButton = document.getElementById("delete-account-button");
		if (deleteButton) {
			deleteButton.removeEventListener("click", this.deleteAccountCallback);
		}

        this._observer.disconnect();
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    async changeAvatar() {
        if (this._insideRequest) {
            return;
        }

        this._insideRequest = true;
        if (this._avatar) {
            const formDataToSend = new FormData();
            formDataToSend.append("avatar", this.avatar);

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
                AbstractView.userInfo.avatar = URL.createObjectURL(
                    this._avatar
                );
                const avatarContainer =
                    document.getElementById("avatar-container");
                avatarContainer.dispatchEvent(
                    new CustomEvent("avatar-container")
                );
                const p = this._parentNode.querySelector("p");

                if (p.classList.contains("form-error")) {
                    p.classList.remove("form-error");
                }
                p.classList.add("form-success");
                p.innerText = "Changes saved";
                setTimeout(() => {
                    p.innerText = "";
                }, 3000);
            } else {
                console.log("Error: failed to change avatar.");
            }
        }

        this._insideRequest = false;
    }

    async getHtml() {
        let avatarElement = document.createElement("avatar-box");
        if (AbstractView.userInfo.avatar) {
            avatarElement.setAttribute("avatar", AbstractView.userInfo.avatar);
        }

        return `
			<div
				class="
					d-flex 
					flex-column 
					flex-md-row 
					align-items-center 
					justify-content-center 
					justify-content-md-evenly 
					vh-100"
				id="profile-page"
			>
				<div class="d-flex flex-column">
					<div class="mb-3">
						${avatarElement.outerHTML}
					</div>
					<div class="position-relative mt-2">
						<p class="form-error"></p>
					</div>
					<div class="box mt-3">
						<div
							class="btn-group-vertical"
							role="group"
							aria-label="Vertical button group"
						>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/username"
								style="border-bottom: 0%; border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
								value="Change Username"
							></nav-button>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/password"
								style="border-radius: 0%"
								value="Change Password"
							></nav-button>
							<logout-button 
								template="primary-button extra-btn-class"
								style="border-radius: 0%"
								value="Logout"
							></logout-button>
							<button 
								type="button" 
								id="delete-account-modal"
								class="btn btn-primary red-button extra-btn-class" 
								style="border-top: 0%; border-top-left-radius: 0; border-top-right-radius: 0;"
								data-bs-toggle="modal" 
								data-bs-target="#exampleModal"
							>
								Delete Account
							</button>
							
							<div 
								class="modal fade" 
								id="exampleModal" 
								tabindex="-1" 
								aria-labelledby="exampleModalLabel" 
								aria-hidden="true"
							>
								<div class="modal-dialog modal-dialog-centered">
									<div class="modal-content bg-dark text-white">
									<div class="modal-header">
										<h1 class="modal-title fs-5" id="exampleModalLabel">Delete Account</h1>
										<button 
											type="button" 
											class="btn-close" 
											data-bs-dismiss="modal" 
											aria-label="Close"
										></button>
									</div>
									<div class="modal-body">
										<h6 
											class="d-flex justify-content-start"
										>
											Are you sure you want to delete your account?
										</h6>
										<h6 
											class="d-flex justify-content-start"
										>
											Click the Cancel button to abort this action.
										</h6>
									</div>
									<div class="modal-footer">
										<button 
											type="button" 
											class="btn btn-secondary" 
											data-bs-dismiss="modal"
										>
											Cancel
										</button>
										<button 
											id="delete-account-button"
											type="button"
											class="btn btn-primary red-button extra-btn-class"
											style="width: 150px"
										>
											Delete Account
										</button>
									</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex flex-column justify-content-center mt-5">
					${this._view.getHtml()}
				</div>
			</div>
        `;
    }
}
