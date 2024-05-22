import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { navigateTo } from "../index";
import { decode, getToken, logout, setToken } from "../functions/tokens";

export default class Login42Page extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login 42");
        this._loading = true;
		this._callbackDefined = false;
		this._previousLocation = localStorage.getItem("previous_location");

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

		let access_token, decodedToken;
		if (this._previousLocation) {
			access_token = await getToken();
			decodedToken = decode(access_token);
		}

		this._callbackDefined = true;
		const query = window.location.search;
		const response = await fetchData(
			"/auth/sso/101010/callback" + query + 
			`&action=${this._previousLocation ? `link&user_id=${decodedToken["user_id"]}` : "register"}`,
			"GET",
			null
		);

		if (response.ok) {
			this._observer.disconnect();
			if (this._previousLocation && this._previousLocation.startsWith("/home/settings")) {
				localStorage.removeItem("previous_location");
				navigateTo(this._previousLocation);
			} else {
				await setToken(response);
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
