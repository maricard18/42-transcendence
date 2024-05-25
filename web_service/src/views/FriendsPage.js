import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import getUserInfo from "../functions/getUserInfo";
import { navigateTo } from "..";
import { getToken } from "../functions/tokens";
import { sendMessage, StatusWebsocket } from "../functions/websocket";

export default class FriendsPage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._loading = true;
        this._parentNode = null;
        this._setFriendCallback = false;
        this._friendCallback = null;
        this._clickCallback = false;
        this._insideRequest = false;

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.addEventListener(location.pathname, this.removeCallbacks);
    }

    async addEventListeners() {
        if (!AbstractView.friendships) {
            return;
        }

        for (let [index, friendship] of AbstractView.friendships.entries()) {
            const avataraAndUsernameDiv = document.getElementById(`friend-${friendship.friend_id}`);
            if (avataraAndUsernameDiv) {
                avataraAndUsernameDiv.addEventListener("click", async () => await navigateTo(`/home/profile/${friendship.friend_id}`));
            }

            const button = document.getElementById(`remove-friendship-${friendship.id}`);
            if (button) {
                button.addEventListener("click", async () => await this.removeFriend(friendship.id));
            }
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

        if (response && response.ok) {
            let friend_id;
            for (let [index, friendship] of AbstractView.friendships.entries()) {
                if (id === friendship.id) {
                    friend_id = friendship.friend_id;
                    AbstractView.friendships.splice(index, 1);
                    break;
                }
            }

            const message = {
                message: "friendship.destroyed",
                friend_id: friend_id
            };
            sendMessage(StatusWebsocket.ws, message);

            this.loadDOMChanges();
        }
    }

    defineCallback = async () => {
        const parentNode = document.getElementById("friends-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        const friendListDiv = document.getElementById("friend-list");
        if (friendListDiv && !this._setFriendCallback) {
            this._setFriendCallback = true;
            friendListDiv.addEventListener("reload-friend-list", this.loadDOMChanges.bind(this));
        }

        if (!this._friendCallback && AbstractView.userInfo.id) {
            this._friendCallback = true;
            this.loadDOMChanges();
        }
    }

    removeCallbacks = () => {
        this._observer.disconnect();
        window.removeEventListener(location.pathname, this.removeCallbacks);
    }

    async loadFriendList() {
        if (!AbstractView.friendships) {
            return ``;
        }

        const accessToken = await getToken();

        const div = document.createElement("div");
        div.setAttribute("class", "mt-2 mb-1");
        div.id = "friends-block-list";
        div.style.maxHeight = "360px";
        div.style.overflowY = "auto";

        for (let [index, friendship] of AbstractView.friendships.entries()) {
            const friendInfo = await getUserInfo(accessToken, friendship.friend_id);

            if (!friendInfo) {
                continue;
            }

            const userDiv = document.createElement("div");
            userDiv.setAttribute("class", "d-flex flex-row friend-block mt-2");
            userDiv.id = `friend-block-${index}`;

            const friendInfoDiv = document.createElement("div");
            friendInfoDiv.setAttribute("class", "d-flex flex-column align-items-start justify-content-start mt-1 ms-1");

            const avataraAndUsernameDiv = document.createElement("div");
            avataraAndUsernameDiv.setAttribute("class", "d-flex flex-row align-items-center pointer ms-2");
            avataraAndUsernameDiv.id = `friend-${friendInfo.id}`;

            if (friendInfo.avatar) {
                const img = document.createElement("img");
                img.setAttribute("class", "white-border-sm");
                img.setAttribute("alt", "Avatar preview");
                img.setAttribute("width", "30");
                img.setAttribute("height", "30");
                img.setAttribute("style", "border-radius: 50%");
                img.setAttribute("src", friendInfo.avatar);
                avataraAndUsernameDiv.appendChild(img);
            } else {
                const avatar = document.createElement("base-avatar-box");
                avatar.setAttribute("size", "30");
                avataraAndUsernameDiv.appendChild(avatar);
            }

            const username = document.createElement("h3");
            username.setAttribute("class", "ms-2 mt-2");
            username.setAttribute("style", "font-size: 18px; font-weight: bold");
            username.innerText = friendInfo.username;
            avataraAndUsernameDiv.appendChild(username);
            friendInfoDiv.appendChild(avataraAndUsernameDiv);

            const onlineStatus = document.createElement("div");
            onlineStatus.id = `online-status-info-${friendInfo.id}`;
            onlineStatus.setAttribute("class", "d-flex flex-row align-items-center ms-2");

            const circle = document.createElement("span");
            circle.setAttribute("class", `${friendship.online ? "online-sm ms-1" : "offline-sm ms-1"}`);
            onlineStatus.appendChild(circle);

            const h3 = document.createElement("h3");
            h3.setAttribute("class", "ms-1 mt-2");
            h3.setAttribute("style", "font-size: 12px; font-weight: bold");
            h3.innerText = friendship.online ? "online" : "offline";
            onlineStatus.appendChild(h3);
            friendInfoDiv.appendChild(onlineStatus);

            userDiv.appendChild(friendInfoDiv);

            const buttonDiv = document.createElement("div");
            buttonDiv.setAttribute("class", "d-flex flex-row align-items-center me-3");
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

    async loadDOMChanges() {
        const parentNode = document.getElementById("friend-list");
        if (parentNode) {
            parentNode.innerHTML = await this.loadFriendList();
            await this.addEventListeners();
        }
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

export async function getFriendship(id) {
    const accessToken = await getToken();
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetchData(
        `/api/friendships/${id}`,
        "GET",
        headers,
        null
    );

    if (response && response.ok) {
        AbstractView.friendships.push(await response.json());
    }
}

export async function getMyFriendships() {
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

    if (response && response.ok) {
        return await response.json();
    }
}

export function updateFriendOnlineStatus(id, action = null) {
    if (!id) {
        return;
    }

    const parentDiv = document.getElementById(`online-status-info-${id}`);
    if (parentDiv && action === "disconnected") {
        const circle = parentDiv.querySelector("span");
        if (circle.classList.contains("online-sm")) {
            circle.classList.remove("online-sm")
            circle.classList.add("offline-sm");
        } else {
            circle.classList.remove("online-lg");
            circle.classList.add("offline-lg");
        }
        const h3 = parentDiv.querySelector("h3");
        h3.innerText = "offline";
    } else if (parentDiv && action === "connected") {
        const circle = parentDiv.querySelector("span");
        if (circle.classList.contains("offline-sm")) {
            circle.classList.remove("offline-sm")
            circle.classList.add("online-sm");
        } else {
            circle.classList.remove("offline-lg");
            circle.classList.add("online-lg");
        }
        const h3 = parentDiv.querySelector("h3");
        h3.innerText = "online";
    }
}

export async function updateFriendsListOnlineStatus(id = null, action = null) {
    for (let [index, friendship] of AbstractView.friendships.entries()) {
        if (id == friendship.friend_id) {
            AbstractView.friendships[index]["online"] = action === "connected" ? true : false;
        } else if (!friendship.online) {
            AbstractView.friendships[index]["online"] = false;
        }

        updateFriendOnlineStatus(id, action);
    }

    const myFriendList = document.getElementById("friend-list");
    if (myFriendList) {
        myFriendList.dispatchEvent(new CustomEvent("reload-friend-list"));
    }
}
