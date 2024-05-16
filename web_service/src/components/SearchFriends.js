import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import { transitDecrypt } from "../functions/vaultAccess";
import AbstractView from "../views/AbstractView";

export default class SearchFriends extends AbstractView {
    constructor() {
        super();
        this._parentNode = null;
		this._abstracttViewCallback = false;
        this._insideRequest = false;
		this._inputCallback = false;
		this._clickCallback = false;
		this._enterCallback = false;

		this._searchBar = "";
		this._userList;

        this._errors = {};
        this._success = {};
        this._formData = {
            username: AbstractView.userInfo.username,
            email: AbstractView.userInfo.email,
        };

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
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

    async defineCallback() {
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
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

		const input = this._parentNode.querySelector("input");
		if (input) {
			input.removeEventListener("input", this.inputCallback);
		}

        const submitButton = document.getElementById("search-button");
        if (submitButton) {
            submitButton.removeEventListener("click", this.buttonClickedCallback);
        }

		window.removeEventListener("keydown", this.keydownCallback);
        this._observer.disconnect();
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
			return ;
		}

		const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
        let newErrors = {};

		if (this._searchBar.length < 3 || this._searchBar.length > 12) {
            newErrors.message = "Username must have 3-12 characters";
            newErrors.search = 1;
            this.errors = newErrors;
        } else if (!usernamePattern.test(this._searchBar)) {
            newErrors.message = "Username has invalid characters";
            newErrors.search = 1;
            this._errors = newErrors;
        }

		if (!newErrors.message) {
			this._insideRequest = true;
			this._accessToken = await getToken();
			const headers = {
				Authorization: `Bearer ${this._accessToken}`,
			};
	
			const response = await fetchData(
				`/api/users?filter[username]=${this._searchBar}`,
				"GET",
				headers,
				null
			);
	
			if (response.ok) {
				this._userList = await response.json();
				console.log("Response:", this._userList);
				await this.loadDOMChanges();
			} else {
				console.error("Error: failed to get user data list ", response.status);
			}
		}


        this._insideRequest = false;
    }

	async loadDOMChanges() {
		const parentNode = document.getElementById("user-list");
		console.log(parentNode);
		parentNode.innerHTML = await this.loadSearchBarResult();
	}

	async loadSearchBarResult() {
		if (!this._userList) {
			return ``;
		}

		const div = document.createElement("div");
		div.setAttribute("class", "mt-4");
		
		const title = document.createElement("h3");
		title.setAttribute("class", "d-flex justify-content-start ms-1");
		title.setAttribute("style", "font-size: 30px; font-weight: bold");
		title.innerText = `Search results for ${this._searchBar}`;
		div.appendChild(title);
		
		for (let user of this._userList.entries()) {
			const userDiv = document.createElement("div");
			userDiv.setAttribute("class", "d-flex flex-row align-items-center user-info mt-3");
			
			if (user[1].avatar) {
				const img = document.createElement("img");
            	img.setAttribute("class", "white-border-sm ms-3");
            	img.setAttribute("alt", "Avatar preview");
            	img.setAttribute("width", "40");
            	img.setAttribute("height", "40");
            	img.setAttribute("style", "border-radius: 50%");
            	img.setAttribute("src", user[1].avatar.link);
				userDiv.appendChild(img);
			} else {
				const avatar = document.createElement("base-avatar-box");
				avatar.setAttribute("template", "ms-3");
				avatar.setAttribute("size", "40");
				userDiv.appendChild(avatar);
			}
			
			const username = document.createElement("h3");
			username.setAttribute("class", "ms-3 mt-2");
			username.setAttribute("style", "font-size: 30px; font-weight: bold");
			username.innerText = await transitDecrypt(user[1].username);
			userDiv.appendChild(username);
			
			const navButton = document.createElement("nav-button");
			navButton.setAttribute("template", "white-friend-button extra-btn-class ms-5");
			navButton.setAttribute("page", `/home/user-info/${user[1].id}`);
			navButton.setAttribute("value", "Add friend");
			userDiv.appendChild(navButton);
			
			div.appendChild(userDiv);
		}
	
		return div.outerHTML;
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
					${await this.loadSearchBarResult()}
				<div>
			</div>
		`;
	}
}
