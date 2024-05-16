import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { navigateTo } from "../index";
import { setToken } from "../functions/tokens";

export default class Login42Page extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login 42");
        this._loading = true;
		this._callbackDefined = false;
		this._previousLocation = localStorage.getItem("previousLocation");

		this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

	async defineCallback() {
		if (this._callbackDefined) {
			return ;
		}

		this._callbackDefined = true;
        const query = window.location.search;
		const response = await fetchData(
			"/auth/sso/101010/callback" + query + "&action=register",
			"GET",
			null
		);

		if (response.ok) {
			await setToken(response);
			this._observer.disconnect();
			if (this._previousLocation && 
				this._previousLocation.startsWith("/home/profile")) {
				localStorage.removeItem("previousLocation");
				navigateTo(this._previousLocation);
			} else {
				navigateTo("/home");
			}
		} else {
			if (response.status === 409) {
				await setToken(response);
				this._observer.disconnect();
				console.log("navigating to create profile 42");
				navigateTo("/create-profile-42");
			} else {
				console.error("Error: failed to sign up with 42");
				this._observer.disconnect();
				navigateTo("/");
			}

			return ;
		}
	}

    async getHtml() {
        return `
			<div class="container" id="login-42-page">
				<loading-icon template="center" size="5rem"></loading-icon>
			</div>
        `;
    }
}
