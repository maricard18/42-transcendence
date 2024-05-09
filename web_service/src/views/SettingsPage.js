import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import {navigateTo} from "..";
import {getToken, logout} from "../functions/tokens";

export default class SettingsPage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._loading = true;
        this._parentNode = null;
        this._avatarCallback = false;
        this._modalCallback = false;
        this._linkCallback = false;
        this._deleteCallback = false;
        this._clickCallback = false;
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

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
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

        this.linkButtonCallback = () => {
            localStorage.setItem("previous_location", location.pathname);
        }

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

        this.removeAvatarCallback = async (event) => {
            const formDataToSend = new FormData();
            formDataToSend.append("avatar", "");

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
                event.target.dispatchEvent(new CustomEvent("remove-avatar"));
                this._clickCallback = false;
            } else {
                console.log("response:", response.body);
                console.error("failed to remove avatar");
            }
        }

        const avatarBox = this._parentNode.querySelector("avatar-box");
        if (avatarBox && !this._avatarCallback) {
            this._avatarCallback = true;
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

        const linkButtonList = this._parentNode.querySelectorAll("nav-button");
        const linkButton = linkButtonList[linkButtonList.length - 1];
        if (linkButton && !this._linkCallback) {
            this._linkCallback = true;
            linkButton.addEventListener("click", this.linkButtonCallback);
        }

		const deleteAccountButton = document.getElementById("delete-account-button");
		if (deleteAccountButton && !this._deleteCallback) {
			this._deleteCallback = true;
			deleteAccountButton.addEventListener("click", this.deleteAccountCallback);
		}

		const deleteAvatarButton = document.getElementById("remove-avatar");
		if (deleteAvatarButton && !this._clickCallback) {
			this._clickCallback = true;
			deleteAvatarButton.addEventListener("click", this.removeAvatarCallback);
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

        const linkButtonList = this._parentNode.querySelectorAll("nav-button");
        const linkButton = linkButtonList[linkButtonList.length - 1];
        if (linkButton) {
            linkButton.removeEventListener("click", this.linkButtonCallback);
        }

        const deleteAccountButton = document.getElementById("#delete-account-button");
        if (deleteAccountButton) {
            deleteAccountButton.removeEventListener("click", this.deleteAccountCallback);
        }

        const deleteAvatarButton = document.getElementById("#remove-avatar");
        if (deleteAvatarButton) {
            deleteAvatarButton.removeEventListener("click", this.removeAvatarCallback);
        }

        this._observer.disconnect();
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
                
				const avatarContainer = document.getElementById("avatar-container");
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
        const link = "https://api.intra.42.fr/oauth/authorize" +
            "?client_id=" + encodeURIComponent(process.env.SSO_42_CLIENT_ID) +
            "&redirect_uri=" + encodeURIComponent(process.env.SSO_42_REDIRECT_URI) +
            "&response_type=code";
        let avatarElement = document.createElement("avatar-box");
        if (AbstractView.userInfo.avatar) {
            avatarElement.setAttribute("avatar", AbstractView.userInfo.avatar);
        }

        return `
			<div class="d-flex flex-column flex-md-row align-items-center justify-content-center vh-100" id="profile-page">
				<div class="d-flex flex-column justify-content-center primary-box me-3">
					<div class="mb-3 mt-2">
						${avatarElement.outerHTML}
					</div>
					<div class="position-relative mt-2">
						<p class="form-error"></p>
					</div>
					<div class="mt-3">
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
							<nav-button
								template="secondary-button extra-btn-class"
								page="${link}"
								style="border-radius: 0%"
								value="Link 42 Account"
							></nav-button>
							
							<button 
								type="button" 
								id="delete-account-modal"
								class="btn btn-primary red-button extra-btn-class" 
								style="border-top-left-radius: 0%; border-top-right-radius: 0%; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"
								data-bs-toggle="modal" 
								data-bs-target="#DeleteUserModal"
							>
								Delete Account
							</button>
							
							<div 
								class="modal fade" 
								id="DeleteUserModal" 
								tabindex="-1" 
								aria-labelledby="DeleteUserModalLabel" 
								aria-hidden="true"
							>
								<div class="modal-dialog modal-dialog-centered">
									<div class="modal-content bg-dark text-white">
										<div class="modal-header">
											<h1 class="modal-title fs-5" id="DeleteUserModalLabel">Delete Account</h1>
											<button 
												type="button" 
												class="btn-close" 
												data-bs-dismiss="modal" 
												aria-label="Close"
											></button>
										</div>
										<div class="modal-body">
											<h6 class="d-flex justify-content-start">
												Are you sure you want to delete your account?
											</h6>
											<h6 class="d-flex justify-content-start">
												This action is irreversible.
											</h6>
											<h6 class="d-flex justify-content-start">
												Click the Cancel button to abort.
											</h6>
										</div>
										<div class="modal-footer">
											<button 
												id="delete-account-button"
												type="button"
												class="btn btn-primary red-button extra-btn-class"
												style="width: 150px"
											>
												Delete Account
											</button>
											<button 
												type="button" 
												class="btn btn-secondary" 
												data-bs-dismiss="modal"
											>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex flex-column secondary-box ms-3">
					${this._view.getHtml()}
				</div>
			</div>
        `;
    }
}
