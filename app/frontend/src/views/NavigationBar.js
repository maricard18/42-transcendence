import { navigateTo } from "../index";
import { routes } from "./router";
import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";

export default class NavigationBar extends AbstractView {
    constructor(view) {
        super();
        this.setTitle("Home");
        this._loading = true;
        this._callbackRunned = false;
        this._view = view;
        this._navigationContent;
        this._avatarContainer;

        this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.disconnectObserver();
        };
    }

    get userInfo() {
        return AbstractView.userInfo;
    }

    set userInfo(value) {
        AbstractView.userInfo = value;
    }

    async defineCallback() {
        if (this._callbackRunned) {
            return;
        }

        this._callbackRunned = true;
        const fetchUserInfo = async () => {
            const userData = await getUserInfo(AbstractView.authed);

            if (userData) {
                this.userInfo = {
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    id: userData.id,
                };
                console.log("User info was collected");
                console.log("info:", this.userInfo);
                this._loading = false;
                console.log(this.userInfo);
                await this.loadDOMChanges();
            } else {
                console.log("Error: failed to fetch user data.");
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
            console.log("User info already collected, loading changes");
            this._loading = false;
            await this.loadDOMChanges();
            console.log(this.userInfo);
        }
    }

    async loadDOMChanges() {
		const navigationBar = document.getElementById("navigation-bar");
		const loading = document.querySelector("loading-icon");
		if (loading) {
			console.log("removing loading icon");
			loading.remove();
			const navigationContent = await this.navigationBarContent();
			navigationBar.appendChild(navigationContent);
			return ;
		}

        const avatarElement = document.querySelector("img");
        const baseAvatar = document.querySelector("base-avatar-box");
        const h6 = document.querySelector("h6");
		h6.innerText = this.userInfo.username;

        if (avatarElement) {
			console.log("Updated avatar")
            avatarElement.setAttribute("src", this.userInfo.avatar);
        } else {
			console.log("removed default avatar and added new one")
            baseAvatar.remove();
            const avatarElement = document.createElement("img");
            avatarElement.setAttribute("class", "avatar-border-sm");
            avatarElement.setAttribute("alt", "Avatar preview");
            avatarElement.setAttribute("width", "40");
            avatarElement.setAttribute("height", "40");
            avatarElement.setAttribute("style", "border-radius: 50%");
            avatarElement.setAttribute("src", this.userInfo.avatar);
            h6.parentNode.insertBefore(avatarElement, h6);
        }
    }

    disconnectObserver() {
        this.observer.disconnect();
    }

	async navigationBarContent() {
		let navigationContent = document.createElement("div");
		const avatarContainer = document.createElement("div");
        avatarContainer.setAttribute("id", "avatar-container");
        avatarContainer.setAttribute("class", "d-flex align-items-center mb-3");

        if (this.userInfo.avatar) {
			console.log("Found an avatar");
            const avatarElement = document.createElement("img");
            avatarElement.setAttribute("class", "avatar-border-sm");
            avatarElement.setAttribute("alt", "Avatar preview");
            avatarElement.setAttribute("width", "40");
            avatarElement.setAttribute("height", "40");
            avatarElement.setAttribute("style", "border-radius: 50%");
            avatarElement.setAttribute("src", this.userInfo.avatar);
            avatarContainer.appendChild(avatarElement);
        } else {
            console.log("No avatar");
            const baseAvatar = document.createElement("base-avatar-box");
            baseAvatar.setAttribute("size", "40");
            avatarContainer.appendChild(baseAvatar);
        }

        const h6 = document.createElement("h6");
        h6.setAttribute("class", "username-text ms-2 mt-1");
        const b = document.createElement("b");
        b.innerText = this.userInfo.username;
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
								value="Home"
							></nav-button>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/username"
								value="Profile"
							></nav-button>
							<logout-button 
								template="white-button extra-btn-class"
								value="Logout"
							></logout-button>
						</div>
					</div>
				</div>
			</nav>
			<div class="center">
				${await this._view.getHtml()}
			</div>
		`;

        return navigationContent;
	}

	loadingComponent() {
		const loading = document.createElement("loading-icon");
		loading.setAttribute("size", "5rem");
		return loading;
	}

    async getHtml() {
        const div = document.createElement("div");
        div.setAttribute("class", "container-fluid");

        const navigationBar = document.createElement("div");
        navigationBar.setAttribute("class", "container-fluid");
        navigationBar.setAttribute("id", "navigation-bar");

		if (this._loading) {
            console.log("Loading");
            const loading = this.loadingComponent();
            navigationBar.appendChild(loading);
			div.appendChild(navigationBar);
			return div.outerHTML;
		} else {
			const navigationBarContent = await this.navigationBarContent();
			navigationBar.appendChild(navigationBarContent);
			div.appendChild(navigationBar);
			return div.outerHTML;
		}
    }
}
