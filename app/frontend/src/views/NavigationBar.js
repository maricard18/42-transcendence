import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";
import { getPageTitle } from "../functions/fetchData";
import { logout } from "../functions/tokens";
import { navigateTo } from "..";

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
            const userData = await getUserInfo(AbstractView.authed);

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
                console.log("Error: failed to fetch user data.");
                logout();
                navigateTo("/");
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

    loadNavigationBarMenuChanges() {
        const avatarElement = document.querySelector("img");
        const baseAvatar = document.querySelector("base-avatar-box");
        const h6 = document.querySelector("h6");
        h6.innerText = AbstractView.userInfo.username;

        if (avatarElement) {
            avatarElement.setAttribute("src", AbstractView.userInfo.avatar);
        } else {
            baseAvatar.remove();
            const avatarElement = document.createElement("img");
            avatarElement.setAttribute("class", "avatar-border-sm");
            avatarElement.setAttribute("alt", "Avatar preview");
            avatarElement.setAttribute("width", "40");
            avatarElement.setAttribute("height", "40");
            avatarElement.setAttribute("style", "border-radius: 50%");
            avatarElement.setAttribute("src", AbstractView.userInfo.avatar);
            h6.parentNode.insertBefore(avatarElement, h6);
        }
    }

    async loadDOMChanges() {
        const navigationBar = document.getElementById("navigation-bar");
        const loading = document.querySelector("loading-icon");
        if (loading) {
            loading.remove();
            const navigationContent = await this.navigationBarContent();
            navigationBar.appendChild(navigationContent);
            return;
        }

        this.loadNavigationBarMenuChanges();
    }

    async navigationBarContent() {
        let navigationContent = document.createElement("div");
        const avatarContainer = document.createElement("div");
        avatarContainer.setAttribute("id", "avatar-container");
        avatarContainer.setAttribute("class", "d-flex align-items-center mb-3");

        if (AbstractView.userInfo.avatar) {
            const avatarElement = document.createElement("img");
            avatarElement.setAttribute("class", "avatar-border-sm");
            avatarElement.setAttribute("alt", "Avatar preview");
            avatarElement.setAttribute("width", "40");
            avatarElement.setAttribute("height", "40");
            avatarElement.setAttribute("style", "border-radius: 50%");
            avatarElement.setAttribute("src", AbstractView.userInfo.avatar);
            avatarContainer.appendChild(avatarElement);
        } else {
            const baseAvatar = document.createElement("base-avatar-box");
            baseAvatar.setAttribute("size", "40");
            avatarContainer.appendChild(baseAvatar);
        }

        const h6 = document.createElement("h6");
        h6.setAttribute("class", "username-text ms-3 mt-1");
        const b = document.createElement("b");
        b.innerText = AbstractView.userInfo.username;
        h6.appendChild(b);
        avatarContainer.appendChild(h6);

        navigationContent.innerHTML = `
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
							${avatarContainer.outerHTML}
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

        return navigationContent;
    }

    loadingComponent() {
        const loading = document.createElement("loading-icon");
        loading.setAttribute("size", "5rem");
		loading.setAttribute("template", "center");
        return loading;
    }

    async getHtml() {
        const navigationBar = document.createElement("div");
        navigationBar.setAttribute("class", "container-fluid");
        navigationBar.setAttribute("id", "navigation-bar");

        if (this._loading) {
            const loading = this.loadingComponent();
            navigationBar.appendChild(loading);
            return navigationBar.outerHTML;
        } else {
            const navigationBarContent = await this.navigationBarContent();
            navigationBar.appendChild(navigationBarContent);
            return navigationBar.outerHTML;
        }
    }
}
