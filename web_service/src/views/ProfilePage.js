import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { getToken } from "../functions/tokens";
import getUserInfo from "../functions/getUserInfo";
import { navigateTo } from "..";

export default class ProfilePage extends AbstractView {
    constructor() {
        super();
		const index = location.pathname.lastIndexOf("/");
		this._userId = location.pathname.substring(index + 1);
        
		this._parentNode = null;
        this._iserInfoCallback = false;

		this._userInfo = null;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    async defineCallback() {
        const parentNode = document.getElementById("profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

		if (!this._iserInfoCallback) {
			this._iserInfoCallback = true;

			this._userInfo = await getUserInfo(null, this._userId);
			if (!this._userInfo) {
				navigateTo("/home/friends");
			} else {
				const parentNode = document.getElementById("profile-page");
				parentNode.innerHTML = await this.loadProfilePage();
			}
		}
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        this._observer.disconnect();
    }

	async loadMatchHistory() {
	//	if (!this._userList) {
	//		return ``;
	//	}
		
	//	const parentDiv = document.createElement("div");
	//	parentDiv.setAttribute("class", "mt-4");

	//	const title = document.createElement("h3");
	//	title.setAttribute("class", "d-flex justify-content-start ms-1");
	//	title.setAttribute("style", "font-size: 25px; font-weight: bold");
	//	title.innerHTML = `Search results for&nbsp;<u>${this._searchBar}</u>`;
	//	parentDiv.appendChild(title);

	//	const div = document.createElement("div");
	//	div.setAttribute("class", "mt-2");
	//	div.id = "user-info-list";
	//	div.style.maxHeight = "320px";
	//	div.style.overflowY = "auto";
		
	//	for (let [index, user] of this._userList.entries()) {
	//		const userDiv = document.createElement("div");
	//		userDiv.setAttribute("class", "d-flex flex-row align-items-center user-info mt-3");
	//		userDiv.id = `user-info-${index}`;

	//		const avataraAndUsernameDiv = document.createElement("div");
	//		avataraAndUsernameDiv.setAttribute("class", "d-flex flex-row align-items-center");
	//		avataraAndUsernameDiv.id = `user-${user.id}`;
			
	//		if (user.avatar) {
	//			const img = document.createElement("img");
    //        	img.setAttribute("class", "white-border-sm ms-3");
    //        	img.setAttribute("alt", "Avatar preview");
    //        	img.setAttribute("width", "40");
    //        	img.setAttribute("height", "40");
    //        	img.setAttribute("style", "border-radius: 50%");
    //        	img.setAttribute("src", user.avatar.link);
	//			avataraAndUsernameDiv.appendChild(img);
	//		} else {
	//			const avatar = document.createElement("base-avatar-box");
	//			avatar.setAttribute("template", "ms-3");
	//			avatar.setAttribute("size", "40");
	//			avataraAndUsernameDiv.appendChild(avatar);
	//		}
			
	//		const username = document.createElement("h3");
	//		username.setAttribute("class", "ms-3 mt-2");
	//		username.setAttribute("style", "font-size: 20px; font-weight: bold");
	//		username.innerText = await transitDecrypt(user.username);
	//		avataraAndUsernameDiv.appendChild(username);
	//		userDiv.appendChild(avataraAndUsernameDiv);

	//		const buttonDiv = document.createElement("div");
	//		buttonDiv.setAttribute("class", "d-flex justify-content-end");
	//		buttonDiv.style.marginLeft = "auto";
			
	//		const button = document.createElement("button");
	//		button.setAttribute("class", "btn btn-primary primary-button extra-btn-class me-3");
	//		button.id = `friend-btn-${user.id}`;
	//		button.style.width = "100px";
	//		button.style.height = "35px";
	//		button.textContent = "Add friend";
	//		buttonDiv.appendChild(button);
	//		userDiv.appendChild(buttonDiv);

	//		div.appendChild(userDiv);
	//	}

	//	parentDiv.appendChild(div);
	
	//	return parentDiv.outerHTML;
	}

	async loadProfilePage() {
		return `
			<div class="center">
				<div class="d-flex flex-column justify-content-start main-box">
					<div id="profile-content" class="mt-2">
						<div class="d-flex flex-column align-items-center mt-2">
							<div id="avatar">
								${
									this._userInfo.avatar
										? `<img
												id="nav-bar-avatar"
												class="white-border-sm"
												src="${this._userInfo.avatar}"
												alt="avatar"
												width="150"
												height="150"
												style="border-radius: 50%"
											/>`
										: `<base-avatar-box size="150"></base-avatar-box>`
								}
							</div>
							<div id="username" class="mt-2">
								<h1 style="font-size: 50px">${this._userInfo.username}</h1>
							</div>
						</div>
					<div>
				</div>
			</div>
		`;
	}

    async getHtml() {
		return `
			<div class="container" id="profile-page">
				<div class="center">
					<loading-icon size="5rem"></loading-icon>
				</div>
			</div>
		`;
	}
}
