import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import { getToken } from "../functions/tokens";
import { transitDecrypt } from "../functions/vaultAccess";
import AbstractView from "./AbstractView";

export default class FirendsPage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._loading = true;
        this._parentNode = null;
		this._setFriendCallback = false;
		this._friendCallback = null;
        this._clickCallback = false;
        this._insideRequest = false;

		this._friendList = null;
        this._errors = {};
        this._avatar = AbstractView.userInfo.avatar;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		this.removeCallbacksBound = this.removeCallbacks.bind(this);
		window.addEventListener("popstate", this.removeCallbacksBound);
    }

	async getMyFriends() {
		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			"/api/friendships",
			"GET",
			headers,
			null
		);

		if (response.ok) {
			this._friendList = await response.json();
			console.log("MyFriendsList:", this._friendList);
			await this.loadDOMChanges();
		} else {
			console.error("Error: failed to fetch my friends list ", response.status);
		}
	}

    async defineCallback() {
        const parentNode = document.getElementById("friends-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

		const friendListDiv = document.getElementById("friend-list");
		if (friendListDiv && !this._setFriendCallback) {
			this._setFriendCallback = true;
			friendListDiv.addEventListener("reload-friend-list", this.getMyFriends);
		}

		if (!this._friendCallback && AbstractView.userInfo.id) {
			this._friendCallback = true;
			await this.getMyFriends();
		}
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

		window.removeEventListener("popstate", this.removeCallbacksBound);

        this._observer.disconnect();
    }

	async loadDOMChanges() {
		const parentNode = document.getElementById("friend-list");
		parentNode.innerHTML = await this.loadFriendList();
	}

	async loadFriendList() {
		if (!this._friendList) {
			return ``;
		}

		const accessToken = await getToken();

		const div = document.createElement("div");
		div.setAttribute("class", "mt-2 mb-1");
		div.id = "friends-block-list";
		div.style.maxHeight = "360px";
		div.style.overflowY = "auto";
		
		for (let [index, user] of this._friendList.entries()) {
			const friendInfo = await getUserInfo(accessToken, user.friend_id);
			console.log("FriendInfo:", friendInfo);
			const userDiv = document.createElement("div");
			userDiv.setAttribute("class", "d-flex flex-row align-items-center friend-block mt-2");
			userDiv.id = `friend-block-${index}`;

			const avataraAndUsernameDiv = document.createElement("div");
			avataraAndUsernameDiv.setAttribute("class", "d-flex flex-row align-items-center");
			avataraAndUsernameDiv.id = `friend-id-${user.id}`;
			
			if (friendInfo.avatar) {
				const img = document.createElement("img");
            	img.setAttribute("class", "white-border-sm ms-3");
            	img.setAttribute("alt", "Avatar preview");
            	img.setAttribute("width", "40");
            	img.setAttribute("height", "40");
            	img.setAttribute("style", "border-radius: 50%");
            	img.setAttribute("src", friendInfo.avatar.link);
				avataraAndUsernameDiv.appendChild(img);
			} else {
				const avatar = document.createElement("base-avatar-box");
				avatar.setAttribute("template", "ms-3");
				avatar.setAttribute("size", "40");
				avataraAndUsernameDiv.appendChild(avatar);
			}
			
			const username = document.createElement("h3");
			username.setAttribute("class", "ms-3 mt-2");
			username.setAttribute("style", "font-size: 20px; font-weight: bold");
			username.innerText = friendInfo.username;
			avataraAndUsernameDiv.appendChild(username);
			userDiv.appendChild(avataraAndUsernameDiv);

			//const buttonDiv = document.createElement("div");
			//buttonDiv.setAttribute("class", "d-flex justify-content-end");
			//buttonDiv.style.marginLeft = "auto";
			
			//const button = document.createElement("button");
			//button.setAttribute("class", "btn btn-primary primary-button extra-btn-class me-3");
			//button.id = `friend-btn-${friendInfo.id}`;
			//button.style.width = "100px";
			//button.style.height = "35px";
			//button.textContent = "Add friend";
			//buttonDiv.appendChild(button);
			//userDiv.appendChild(buttonDiv);

			div.appendChild(userDiv);
		}
	
		return div.outerHTML;
	}

    async getHtml() {
        return `
			<div class="d-flex flex-column flex-md-row align-items-center justify-content-center vh-100" id="friends-page">
				<div class="d-flex flex-column justify-content-start primary-box me-3">
					<div class="d-flex flex-row justify-content-center mt-2">
						<h1 style="font-size: 30px; font-weight: bold">My Friends</h1>
					</div>
					<div class="d-flex flex-row justify-content-center mt-3" id="friend-list">
						<loading-icon size="3rem"></loading-icon>
					</div>
				</div>
				<div class="d-flex flex-column secondary-box ms-3">
					${this._view ? await this._view.getHtml() : ""}
				</div>
			</div>
        `;
    }
}
