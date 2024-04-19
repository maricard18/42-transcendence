import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";
import { navigateTo } from "../index";
import { setToken } from "../functions/tokens";

export default class Login42Page extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login 42");
        this._loading = true;
		this._callbacksRemoved = true;
		this._insideRequest = false;

		this.observer = new MutationObserver(this.defineCallback.bind(this));
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

	async defineCallback() {
        const query = window.location.search;

		const response = await fetchData(
			"/auth/sso/101010/callback" + query + "&action=register",
			"GET",
			null
		);

		if (response.ok) {
			await setToken(response, setAuthed);
			this.disconnectObserver();
			navigateTo("/menu");
		} else {
			if (response.status === 409) {
				await setToken(response, setAuthed);
				this.disconnectObserver();
				navigateTo("/create-profile/42");
			} else {
				console.error("Error: failed to sign up with 42");
				this.disconnectObserver();
				navigateTo("/");
			}
		}
	}

	disconnectObserver() {
        this.observer.disconnect();
    }

    async getHtml() {
        return `
			<div class="container" id="login-42-page">
				<loading-icon size="5rem"></loading-icon>
			</div>
        `;
    }
}