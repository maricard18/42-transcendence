import { navigateTo } from "../index";
import AbstractView from "./AbstractView";
import getUserInfo from "../functions/getUserInfo";

export default class NavigationBar extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        this.loading = true;
		this.callbackRunned = false;

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
		if (this.callbackRunned) {
			return;
		}

		this.callbackRunned = true;
        const fetchUserInfo = async () => {
            const userData = await getUserInfo(AbstractView.authed);

            if (userData) {
                this.userInfo = {
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    id: userData.id,
                };
                this.loading = false;
				console.log("User info collected")
				console.log(this.userInfo);
				this.render();
            } else {
                console.log("Error: failed to fetch user data.");
            }
        };

		console.log(this.userInfo);
        if (Object.values(AbstractView.userInfo).some((element) => element === "")) {
            fetchUserInfo();
        } else {
            this.loading = false;
			console.log("No User info collected")
			this.render();
        }
    }

    disconnectObserver() {
        this.observer.disconnect();
    }

	async render() {
        const element = document.querySelector("#navigation-bar");
        if (element) {
            element.innerHTML = await this.getHtml();
        }
    }


    async getHtml() {
        if (!AbstractView.authed.value) {
			console.log("Not Authenticated")
            navigateTo("/");
        }

        return `
		<div class="container-fluid" id="navigation-bar">
		${
            this.loading
                ? `<loading-icon size="5rem"></loading-icon>`
                : `<div>
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
						<div class="dropdown-menu dropdown-menu-end menu-box">
							<div
								class="btn-group-vertical d-flex flex-column"
								role="group"
								aria-label="Vertical button group"
							>
								<div class="d-flex align-items-center mb-3">
									${
                                        this.userInfo.avatar
                                            ? `<img
												src=${this.userInfo.avatar}
												alt="Avatar preview"
												width="40"
												height="40"
												class="avatar-border-sm"
												style="border-radius: 50%"
											/>`
                                            : `<base-avatar
												size="40"
											><base-avatar>`
                                    }
									<h6 class="username-text ms-2 mt-1">
										<b>${this.userInfo.username}</b>
									</h6>
								</div>
								<nav-button
									template="white-button"
									page="/menu"
									value="Home"
								></nav-button>
								<nav-button
									template="white-button"
									page="/menu/profile/username"
									value="Profile"
								></nav-button>
								<logout-button 
									template="white-button"
									value="Logout"
								></logout-button>
							</div>
						</div>
					</div>
				</nav>
				<div>
					<h1>Other components</h1>
				</div>
			</div>`
        }
		</div>
        `;
    }
}
