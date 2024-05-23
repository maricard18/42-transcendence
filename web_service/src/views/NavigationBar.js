import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";
import { navigateTo } from "..";
import { getPageTitle } from "../functions/fetchData";

export default class NavigationBar extends AbstractView {
    constructor(view) {
        super();
        this.setTitle(getPageTitle(location.pathname));
        this._view = view;
        this._loading = true;
        this._callbackRunned = false;
        this._avatarContainerCallback = false;

        this.observer = new MutationObserver(this.defineCallback);
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    defineCallback = async () => {
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
            } else {
				console.debug("Error: failed to fetch user data");
            }
			
			await this.loadDOMChanges();
        };

        let emptyFieldExists = false;
        Object.keys(AbstractView.userInfo).forEach((key) => {
            if (key !== "avatar" && !AbstractView.userInfo[key]) {
                emptyFieldExists = true;
            }
        });

        if (emptyFieldExists) {
            await fetchUserInfo();
        } else {
            this._loading = false;
            await this.loadDOMChanges();
        }
    }

	addEventListeners() {
		const avatarContainer = document.getElementById("avatar-container");
		if (avatarContainer && AbstractView.userInfo.id) {
			avatarContainer.addEventListener("click", async () => {
				await navigateTo(`/home/profile/${AbstractView.userInfo.id}`)
			});
		}
	}

    async loadDOMChanges() {
        const parentNode = document.getElementById("navigation-bar");
		if (parentNode) {
			parentNode.innerHTML = await this.loadNavigationBarContent();
			this.addEventListeners();
		}
    }

	loadNavigationBarMenuChanges = () => {
		const div = document.createElement("div");
		const avatarContainer = document.getElementById("avatar-container");
        const img = avatarContainer.querySelector("img");
        const baseAvatar = avatarContainer.querySelector("base-avatar-box");
        const h6 = avatarContainer.querySelector("h6");
        h6.innerText = AbstractView.userInfo.username ? AbstractView.userInfo.username : "loading ...";

		if (!AbstractView.userInfo.avatar) {
			if (img) {
				const noAvatar = document.createElement("base-avatar-box");
				noAvatar.setAttribute("size", "40");
				h6.parentNode.insertBefore(noAvatar, h6);
				div.appendChild(noAvatar);
				div.appendChild(h6);

				if (avatarContainer) {
					avatarContainer.innerHTML = div.innerHTML;
				}
			}
			
			this.addEventListeners();
			return ;
		}

        if (img) {
            img.setAttribute("src", AbstractView.userInfo.avatar);
        } else if (baseAvatar) {
            const img = document.createElement("img");
			img.setAttribute("id", "nav-bar-avatar");
            img.setAttribute("class", "white-border-sm");
            img.setAttribute("alt", "Avatar preview");
            img.setAttribute("width", "40");
            img.setAttribute("height", "40");
            img.setAttribute("style", "border-radius: 50%");
            img.setAttribute("src", AbstractView.userInfo.avatar);
            div.appendChild(img);
			div.appendChild(h6);

			if (avatarContainer) {
				avatarContainer.innerHTML = div.innerHTML;
			}
			
			this.addEventListeners();
        }
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
							<div class="d-flex flex-row align-items-center pointer mb-3 ms-2" id="avatar-container">
							${
								AbstractView.userInfo.avatar
									? `<img
											id="nav-bar-avatar"
											class="white-border-sm"
											src="${AbstractView.userInfo.avatar}"
											alt="avatar"
											width="40"
											height="40"
											style="border-radius: 50%"
										/>`
									: `<base-avatar-box size="40"></base-avatar-box>`
							}
								<h6 id="nav-bar-username" class="username-text ms-3 mt-1" style="font-size: 20px">
									<b>${AbstractView.userInfo.username ? AbstractView.userInfo.username : "loading ..."}</b>
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
								page="/home/friends"
								style="border-radius: 0%"
								value="Friends"
							></nav-button>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/${AbstractView.userInfo.id}"
								style="border-radius: 0%"
								value="Profile"
							></nav-button>
							<nav-button
								template="secondary-button extra-btn-class"
								page="/home/settings/account"
								style="border-radius: 0%"
								value="Settings"
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
		return `
			<div class="container-fluid" id="navigation-bar">
				<loading-icon template="center" size="5rem"></loading-icon>
			</div>
		`;
    }
}
