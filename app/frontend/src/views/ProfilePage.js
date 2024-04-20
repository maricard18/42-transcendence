import AbstractView from "./AbstractView";
import { getToken, decode } from "../functions/tokens";

export default class ProfilePage extends AbstractView {
    constructor() {
        super();
        this._loading = true;
        this._callbacksDefined = false;
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
        if (this._callbacksDefined) {
            return;
        }

        this._callbacksDefined = true;

        this.avatarCallback = (event) => {
			console.log("avatar changed")
            this._avatar = event.detail;
			this.changeAvatar();
        };

        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.addEventListener("avatar-change", this.avatarCallback);
        }

        window.addEventListener("keydown", this.keydownCallback);
    }

    removeCallbacks() {
        const avatarBox = document.querySelector("avatar-box");
        if (avatarBox) {
            avatarBox.removeEventListener("avatar-change", this.inputCallback);
        }

        this._observer.disconnect();
    }

    get userInfo() {
        return AbstractView.userInfo;
    }

    set userInfo(value) {
        AbstractView.userInfo = value;
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

            console.log("DataToBeSent:", formDataToSend);

			const accessToken = await getToken(setAuthed);
			const decodedToken = decode(accessToken);
			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};

			const response = await fetchData(
				"/api/users/" + decodedToken["user_id"],
				"PUT",
				headers,
				formDataToSend
			);

            if (response.ok) {
                this.userInfo = {
                    ...this.userInfo,
                    avatar: URL.createObjectURL(this._avatar)
                };
                this.removeCallbacks();
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
			</div>
        `;
    }
}

{/*<div class="d-flex flex-column justify-content-center">
				${await (async () => {
					if (this._view.length > 1) {
						const htmlArray = await Promise.all(
							this._view.map((view) => view.getHtml())
						);
						return htmlArray.join("");
					} else {
						return await this._view.getHtml();
					}
				})()}
				</div>*/}