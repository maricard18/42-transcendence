import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import { navigateTo } from "..";
import { getToken } from "../functions/tokens";

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

		this._friendshipList = null;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		this.removeCallbacksBound = this.removeCallbacks.bind(this);
		window.addEventListener("popstate", this.removeCallbacksBound);
    }

	async addEventListeners() {
		if (!this._friendshipList) {
			return ;
		}
		
        for (let [index, friendship] of this._friendshipList.entries()) {
            const avataraAndUsernameDiv = document.getElementById(`friend-${friendship.friend_id}`);
            avataraAndUsernameDiv.addEventListener("click", async () => await navigateTo(`/home/profile/${friendship.friend_id}`));

            const button = document.getElementById(`remove-friendship-${friendship.id}`);
            button.addEventListener("click", async () => await this.removeFriend(friendship.id));
        }
    };

	async removeFriend(id) {
		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			`/api/friendships/${id}`,
			"DELETE",
			headers,
			null
		);

		if (response.ok) {
			await this.getMyFriends();
		} else {
			console.error("Error: failed to delete friend ", response.status);
		}
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
			this._friendshipList = await response.json();
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
			friendListDiv.addEventListener("reload-friend-list", this.getMyFriends.bind(this));
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
		await this.addEventListeners();
	}

	async loadFriendList() {
		if (!this._friendshipList) {
			return ``;
		}

		const accessToken = await getToken();

		const div = document.createElement("div");
		div.setAttribute("class", "mt-2 mb-1");
		div.id = "friends-block-list";
		div.style.maxHeight = "360px";
		div.style.overflowY = "auto";
		
		for (let [index, friendship] of this._friendshipList.entries()) {
			const friendInfo = await getUserInfo(accessToken, friendship.friend_id);

			const userDiv = document.createElement("div");
			userDiv.setAttribute("class", "d-flex flex-row friend-block mt-2");
			userDiv.id = `friend-block-${index}`;

			const friendInfoDiv = document.createElement("div");
			friendInfoDiv.setAttribute("class", "d-flex flex-column align-items-start justify-content-start mt-1 ms-1");

			const avataraAndUsernameDiv = document.createElement("div");
			avataraAndUsernameDiv.setAttribute("class", "d-flex flex-row align-items-center avatar-username");
			avataraAndUsernameDiv.id = `friend-${friendInfo.id}`;
			
			if (friendInfo.avatar) {
				const img = document.createElement("img");
            	img.setAttribute("class", "white-border-sm ms-3");
            	img.setAttribute("alt", "Avatar preview");
            	img.setAttribute("width", "30");
            	img.setAttribute("height", "30");
            	img.setAttribute("style", "border-radius: 50%");
            	img.setAttribute("src", friendInfo.avatar);
				avataraAndUsernameDiv.appendChild(img);
			} else {
				const avatar = document.createElement("base-avatar-box");
				avatar.setAttribute("template", "ms-1");
				avatar.setAttribute("size", "30");
				avataraAndUsernameDiv.appendChild(avatar);
			}

			const username = document.createElement("h3");
			username.setAttribute("class", "ms-2 mt-2");
			username.setAttribute("style", "font-size: 18px; font-weight: bold");
			username.innerText = friendInfo.username;
			avataraAndUsernameDiv.appendChild(username);
			friendInfoDiv.appendChild(avataraAndUsernameDiv);
			userDiv.appendChild(friendInfoDiv);

			const buttonDiv = document.createElement("div");
			buttonDiv.setAttribute("class", "d-flex flex-row align-items-center me-2");
			buttonDiv.style.marginLeft = "auto";
			
			const button = document.createElement("button");
			button.setAttribute("id", `remove-friendship-${friendship.id}`);
			button.setAttribute("type", "button");
			button.setAttribute("class", "btn-close align-itens-bottom");
			button.setAttribute("aria-label", "Close");
			buttonDiv.appendChild(button);
			userDiv.appendChild(buttonDiv);
			
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
					<div class="d-flex flex-row justify-content-center mt-2" id="friend-list">
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
