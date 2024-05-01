import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";
import { getPageTitle } from "../functions/fetchData";

export default class NavigationBar extends AbstractView {
    constructor(view) {
        super();
        this.setTitle(getPageTitle(location.pathname));
        this._view = view;
        this._loading = true;
        this._callbackRunned = false;
        this._avatarContainerCallback = false;

        this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.disconnectObserver();
        };
    }

    async defineCallback() {
        const avatarContainer = document.getElementById("avatar-container");
        if (avatarContainer && !this._avatarContainerCallback) {
            this._avatarContainerCallback = true;
            avatarContainer.addEventListener(
                "avatar-container",
                this.loadNavigationBarMenuChanges
            );
        }

        if (this._callbackRunned) {
            return;
        }

        this._callbackRunned = true;
        const fetchUserInfo = async () => {
            const userData = await getUserInfo();

            if (userData) {
                AbstractView.userInfo = {
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    id: userData.id,
                };
                this._loading = false;
                await this.loadDOMChanges();
            } else {
                console.error("Error: failed to fetch user data");
            }
        };

        let emptyFieldExists = false;
        Object.keys(AbstractView.userInfo).forEach((key) => {
            if (key !== "avatar" && !AbstractView.userInfo[key]) {
                emptyFieldExists = true;
            }
        });

        if (emptyFieldExists) {
            fetchUserInfo();
        } else {
            this._loading = false;
            await this.loadDOMChanges();
        }
    }

    disconnectObserver() {
        this.observer.disconnect();
    }

    async loadDOMChanges() {
        const parentNode = document.getElementById("navigation-bar");
        const loadingIcon = parentNode.querySelector("loading-icon");
        if (loadingIcon) {
            loadingIcon.remove();
        }

        parentNode.innerHTML = await this.loadNavigationBarContent();
    }

    async loadNavigationBarContent() {
        return `
			<nav class="navbar navbar-dark navbar-layout fixed-top">
				<p>
					<nav-link
						href="/home"
						template="navbar-brand navbar-text-layout ms-5"
						value="Transcendence"
					></nav-link>
				</p>
				<div class="btn-group me-5">
					<button
						type="button"
						class="btn btn-secondary navbar-icon"
						data-bs-toggle="dropdown"
						data-bs-display="static"
						aria-expanded="false"
					>
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="dropdown-menu dropdown-menu-end menu-box extra-menu-class">
						<div
							class="btn-group-vertical d-flex flex-column"
							role="group"
							aria-label="Vertical button group"
						>
							<div class="d-flex flex-row align-items-center mb-3" id="avatar-container">
							${
                                AbstractView.userInfo.avatar
                                    ? 	`<img
											id="nav-bar-avatar"
											class="white-border-sm"
											src="${AbstractView.userInfo.avatar}"
											alt="avatar"
											width="40"
											height="40"
											style="border-radius: 50%"
										/>`
                                    : 	`<base-avatar-box size="40"></base-avatar-box>`
                            }
								<h6 id="nav-bar-username" class="username-text ms-2 mt-1">
									<b>${AbstractView.userInfo.username}</b>
								</h6>
							</div>
							<nav-button
								template="white-button extra-btn-class"
								page="/home"
								style="border-bottom: 0%; border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
								value="Home"
							></nav-button>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/username"
								style="border-radius: 0%"
								value="Profile"
							></nav-button>
							<logout-button 
								template="primary-button extra-btn-class"
								style="border-top: 0%; border-top-left-radius: 0; border-top-right-radius: 0;"
								value="Logout"
							></logout-button>
						</div>
					</div>
				</div>
			</nav>
			${await this._view.getHtml()}
		`;
    }

    async getHtml() {
        if (this._loading) {
            return `
				<div class="container-fluid" id="navigation-bar">
					<loading-icon template="center" size="5rem"></loading-icon>
				</div>
			`;
        } else {
            return `
				<div class="container-fluid" id="navigation-bar">
					${await this.loadNavigationBarContent()}
				</div>
			`;
        }
    }
}
