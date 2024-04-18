import { navigateTo } from "../index";
import { routes } from "./router";
import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";

export default class NavigationBar extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        this._loading = true;
        this._callbackRunned = false;
        this._view = new routes[5].children[0].view();
		this._navigationContent;

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
                this._loading = false;
				this.loadDOMChanges();
                console.log("User info was collected");
                console.log("info:", this.userInfo);
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
            this._loading = false;
			this.loadDOMChanges();
            console.log("User info already collected");
			console.log(this.userInfo);
        }
    }

	loadDOMChanges() {
		const navigationBar = document.getElementById("navigation-bar");
		if (navigationBar) {
			navigationBar.innerHTML = this._navigationContent;
		}
	}

    disconnectObserver() {
        this.observer.disconnect();
    }

    async getHtml() {
        const div = document.createElement("div");
        div.setAttribute("class", "container-fluid");

        const navigationBar = document.createElement("div");
        navigationBar.setAttribute("class", "container-fluid");
        navigationBar.setAttribute("id", "navigation-bar");

		const avatarContainer = document.createElement("div");
		avatarContainer.setAttribute("class", "d-flex align-items-center mb-3");

		if (this.userInfo.avatar) {
			const avatarElement = document.createElement("img");
			avatarElement.setAttribute("class", "avatar-border-sm");
			avatarElement.setAttribute("alt", "Avatar preview");
			avatarElement.setAttribute("width", "40");
			avatarElement.setAttribute("height", "40");
			avatarElement.setAttribute("style", "border-radius: 50%");
			avatarElement.setAttribute("src", this.userInfo.avatar);
			avatarContainer.appendChild(avatarElement);
		} else {
			const baseAvatar = document.createElement("base-avatar");
			baseAvatar.setAttribute("size", "40");
			avatarContainer.appendChild(baseAvatar);
		}

        const h6 = document.createElement("h6");
        h6.setAttribute("class", "username-text ms-2 mt-1"); 
		const b = document.createElement("b");
		b.innerText = this.userInfo.username
        h6.appendChild(b);
        avatarContainer.appendChild(h6);

		this._navigationContent = 
			`<div>
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
			</div>`;

		if (this._loading) {
			const loading = document.createElement("loading-icon");
			loading.setAttribute("size", "5rem");
			navigationBar.appendChild(loading);
		} else {
			navigationBar.innerHTML = this._navigationContent;
		}
        
		div.appendChild(navigationBar);
		return div.outerHTML;
    }
}
