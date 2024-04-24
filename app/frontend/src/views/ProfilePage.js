import AbstractView from "./AbstractView";
import { getToken } from "../functions/tokens";
import fetchData from "../functions/fetchData";

export default class ProfilePage extends AbstractView {
    constructor(view) {
        super();
		this._view = view;
        this._loading = true;
        this._avatarCallback = false;
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
        this.avatarCallback = (event) => {
            this._avatar = event.detail;
			this.changeAvatar();
        };

        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox && !this._avatarCallback) {
			this._avatarCallback = true;
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }
    }

    removeCallbacks() {
        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.removeEventListener("avatar-change", this.avatarCallback);
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
				AbstractView.userInfo.avatar = URL.createObjectURL(this._avatar);
				const avatarContainer = document.getElementById("avatar-container");
				avatarContainer.dispatchEvent(new CustomEvent("avatar-container"));
            } else {
				console.log("Error: failed to fetch user data.");
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
			>
				<div class="d-flex flex-column">
					<div class="mb-3">
						${avatarElement.outerHTML}
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
								value="Change Username"
							></nav-button>
							<nav-button
								template="white-button extra-btn-class"
								page="/home/profile/password"
								value="Change Password"
							></nav-button>
							<logout-button 
								template="primary-button extra-btn-class"
								value="Logout"
							></logout-button>
						</div>
					</div>
				</div>
				<div class="d-flex flex-column justify-content-center">
					${this._view.getHtml()}
				</div>
			</div>
        `;
    }
}
