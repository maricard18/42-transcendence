import AbstractView from "../views/AbstractView";
import fetchData from "../functions/fetchData";
import { navigateTo } from "..";
import { getToken } from "../functions/tokens";
import { getFriendship } from "../views/FriendsPage";
import { transitDecrypt } from "../functions/vaultAccess";
import { sendMessage, StatusWebsocket } from "../functions/websocket";

export default class SearchFriends extends AbstractView {
    constructor() {
        super();
        this._parentNode = null;
		this._abstracttViewCallback = false;
        this._insideRequest = false;
		this._inputCallback = false;
		this._clickCallback = false;
		this._enterCallback = false;
		this._loadDOM = false;

		this._searchBar = "";
		this._userList = null;

        this._errors = {};
        this._success = {};

        this._observer = new MutationObserver(this.defineCallback);
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

		window.addEventListener(location.pathname, this.removeCallbacks);
    }

	inputCallback = (event) => {
		const value = event.target.value;
		event.target.setAttribute("value", value);
		this._searchBar = value;
	};

	buttonClickedCallback = () => {
		this.handleValidation();
	};

	keydownCallback = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			this.handleValidation();
		}
	};

    defineCallback = async () => {
        const parentNode = document.getElementById("search-friends");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

		const input = this._parentNode.querySelector("input");
        if (input && !this._inputCallback) {
            this._inputCallback = true;
            input.addEventListener("input", this.inputCallback);
        }

        const submitButton = document.getElementById("search-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener("click", this.buttonClickedCallback);
        }

        if (!this._enterCallback) {
            this._enterCallback = true;
            window.addEventListener("keydown", this.keydownCallback);
        }

		if (!this._loadDOM) {
			this._loadDOM = true;
			this.loadDOMChanges();
		}
	}

    removeCallbacks = () => {
		this._observer.disconnect();
		window.removeEventListener("keydown", this.keydownCallback);
		window.removeEventListener(location.pathname, this.removeCallbacks);

		if (!this._parentNode) {
            return;
        }
		
		const input = this._parentNode.querySelector("input");
		if (input) {
			input.removeEventListener("input", this.inputCallback);
		}

        const submitButton = this._parentNode.querySelector("#search-button");
        if (submitButton) {
            submitButton.removeEventListener("click", this.buttonClickedCallback);
        }
    }

	get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;

        if (this._errors.message) {
            const p = this._parentNode.querySelector("p");
            p.innerText = this._errors.message;

            const input = this._parentNode.querySelector("input");
			if (this._errors.search) {
				input.classList.add("input-error");
				this._searchBar = input.value;
				setTimeout(() => {
					input.classList.remove("input-error");
				}, 3000);
			} else if (input.classList.contains("input-error")) {
				input.classList.remove("input-error");
			}

			setTimeout(() => {
				p.innerText = "";
			}, 3000);
        }
    }

	async handleValidation() {
        if (this._insideRequest) {
            return;
        }

		if (!this._searchBar) {
			this._insideRequest = false;
			this._userList = null;
			await this.loadDOMChanges();
			return ;
		}

		const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

		if (this._searchBar.length > 12) {
            newErrors.message = "Username can't have more than 12 characters";
            newErrors.search = 1;
            this.errors = newErrors;
        } else if (!usernamePattern.test(this._searchBar)) {
            newErrors.message = "Username has invalid characters";
            newErrors.search = 1;
            this._errors = newErrors;
        }

		if (!newErrors.message) {
			this._insideRequest = true;
			const accessToken = await getToken();
			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};
	
			const response = await fetchData(
				`/api/users?filter[username]=${this._searchBar}`,
				"GET",
				headers,
				null
			);
	
			if (response && response.ok) {
				this._userList = await response.json();
				await this.loadDOMChanges();
			}
		}

        this._insideRequest = false;
    }

	async addEventListeners() {
		if (!this._userList) {
			return ;
		}

        for (let [index, user] of this._userList.entries()) {
            const avataraAndUsernameDiv = document.getElementById(`user-${user ? user.id : 0}`);
			if (avataraAndUsernameDiv) {
				avataraAndUsernameDiv.addEventListener("click", async () => await navigateTo(`/home/profile/${user ? user.id : 0}`));
			}

            const button = document.getElementById(`friend-btn-${user ? user.id : 0}`);
			if (button) {
				button.addEventListener("click", async () => await this.addFriend(user ? user.id : 0));
			}
        }
    };

	async loadAllUsers() {
		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			"/api/users?filter[is_active]=true",
			"GET",
			headers,
			null
		);

		if (response && response.ok) {
			return await response.json();
		}
	}

	async addFriend(id) {
		const formDataToSend = new FormData();
		formDataToSend.append("user_id", AbstractView.userInfo.id);
		formDataToSend.append("friend_id", id);

		const accessToken = await getToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await fetchData(
			"/api/friendships",
			"POST",
			headers,
			formDataToSend
		);

		if (response && response.ok) {
			const data = await response.json();
			await getFriendship(data.id);

			const message = {
				message: "friendship.created",
				friend_id: id
			};
			sendMessage(StatusWebsocket.ws, message);

			const myFriendList = document.getElementById("friend-list");
			if (myFriendList) {
				myFriendList.dispatchEvent( new CustomEvent("reload-friend-list") );
			}
		}
	}

	async loadDOMChanges() {
		const parentNode = document.getElementById("user-list");
		if (parentNode) {
			parentNode.innerHTML = await this.loadSearchBarResult();
			await this.addEventListeners();
		}
	}

	async loadSearchBarResult() {
		let showAllUsers = false;

		if (!this._userList) {
			showAllUsers = true;
			this._userList = await this.loadAllUsers();
		}
		
		const parentDiv = document.createElement("div");
		parentDiv.setAttribute("class", "mt-4");

		if (!showAllUsers && this._searchBar) {
			const title = document.createElement("h3");
			title.setAttribute("class", "d-flex justify-content-start ms-1");
			title.setAttribute("style", "font-size: 25px; font-weight: bold");
			if (this._userList.length) {
				title.innerHTML = `Search results for&nbsp;<u>${this._searchBar}</u>`;
			} else  {
				title.innerHTML = `No search results for&nbsp;<u>${this._searchBar}</u>`;
			}
			parentDiv.appendChild(title);
		}

		const div = document.createElement("div");
		div.setAttribute("class", "mt-2");
		div.id = "user-info-list";
		div.style.maxHeight = "320px";
		div.style.overflowY = "auto";

		if (!this._userList) {
			return "";
		}
		
		for (let [index, user] of this._userList.entries()) {
			if (user.id == AbstractView.userInfo.id) {
				continue ;
			}

			const userDiv = document.createElement("div");
			userDiv.setAttribute("class", "d-flex flex-row align-items-center user-info mt-3");
			userDiv.id = `user-info-${index}`;

			const avataraAndUsernameDiv = document.createElement("div");
			avataraAndUsernameDiv.setAttribute("class", "d-flex flex-row align-items-center pointer");
			avataraAndUsernameDiv.id = `user-${user.id}`;
			
			if (user.avatar) {
				const img = document.createElement("img");
            	img.setAttribute("class", "white-border-sm ms-3");
            	img.setAttribute("alt", "Avatar preview");
            	img.setAttribute("width", "40");
            	img.setAttribute("height", "40");
            	img.setAttribute("style", "border-radius: 50%");
            	img.setAttribute("src", user.avatar.link);
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
			username.innerText = await transitDecrypt(user.username);
			avataraAndUsernameDiv.appendChild(username);
			userDiv.appendChild(avataraAndUsernameDiv);

			const buttonDiv = document.createElement("div");
			buttonDiv.setAttribute("class", "d-flex justify-content-end");
			buttonDiv.style.marginLeft = "auto";
			
			const button = document.createElement("button");
			button.setAttribute("class", "btn btn-primary primary-button extra-btn-class me-3");
			button.id = `friend-btn-${user.id}`;
			button.style.width = "100px";
			button.style.height = "35px";
			button.textContent = "Add friend";
			buttonDiv.appendChild(button);
			userDiv.appendChild(buttonDiv);

			div.appendChild(userDiv);
		}

		parentDiv.appendChild(div);
	
		return parentDiv.outerHTML;
	}

    async getHtml() {
		return `
			<div class="d-flex flex-column justify-content-center" id="search-friends">
				<div class="ms-2 position-relative">
					<p class="form-error" style="top: 50px; text-align: left"></p>
				</div>
				<div class="d-flex mt-1">
					<input class="form-control me-2" type="search" placeholder="Search for usernames here" aria-label="Search">
					<button id="search-button" class="btn primary-button extra-btn-class" style="width: 120px">Search</button>
				</div>
				<div id="user-list" class="mt-2">
					<loading-icon size="3rem"></loading-icon>
				<div>
			</div>
		`;
	}
}
