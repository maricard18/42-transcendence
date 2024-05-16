import AbstractView from "./AbstractView";

export default class FirendsPage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._loading = true;
        this._parentNode = null;
        this._clickCallback = false;
        this._insideRequest = false;

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

    defineCallback() {
        const parentNode = document.getElementById("profile-page");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

		window.removeEventListener("popstate", this.removeCallbacksBound);

        this._observer.disconnect();
    }

    async getHtml() {
        return `
			<div class="d-flex flex-column flex-md-row align-items-center justify-content-center vh-100" id="profile-page">
				<div class="d-flex flex-column justify-content-center primary-box me-3">
					<h3>Friends List</h3>
				</div>
				<div class="d-flex flex-column secondary-box ms-3">
					${this._view ? await this._view.getHtml() : ""}
				</div>
			</div>
        `;
    }
}
