import AbstractView from "../views/AbstractView";

export default class PongGameMenu extends AbstractView {
	constructor(view) {
        super();
        this._view = view;
        this._parentNode = null;
        this._callback = false;
		this._clickCallback = false;
		this._readyState = false;

        //this._observer = new MutationObserver(this.defineCallback.bind(this));
        //this._observer.observe(document.body, {
        //    childList: true,
        //    subtree: true,
        //});

        //window.onbeforeunload = () => {
        //    this.removeCallbacks();
        //};
    }

    loadDOMChanges() {
		const parentNode = document.getElementById("ready-button");
        parentNode.innerHTML = this.loadGameMenu();
		this._clickCallback = false;
    }

    loadGameMenu() {
        return `
			<div class="btn-group dropup mt-3">
				<button 
					type="button" 
					class="btn btn-secondary dropdown-toggle full-white-button extra-btn-class" 
					data-bs-toggle="dropdown" 
					aria-expanded="false"
				>
					Customize game
				</button>
				<ul class="dropdown-menu">
				
				</ul>
			</div>
		`;
    }

    getHtml() {
        return this.loadGameMenu();
	}
}