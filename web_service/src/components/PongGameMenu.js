import AbstractView from "../views/AbstractView";

export default class PongGameMenu extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._parentNode = null;
        this._callback = false;
        this._clickCallback = false;
        this._readyState = false;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
        };
    }

    defineCallback() {
        const parentNode = document.getElementById("pong-menu");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this._clickCallback = () => {

        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton && !this._clickCallback) {
            this._clickCallback = true;
            submitButton.addEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        const submitButton = this._parentNode.querySelector("submit-button");
        if (submitButton) {
            submitButton.removeEventListener(
                "buttonClicked",
                this.buttonClickedCallback
            );
        }

        this._observer.disconnect();
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("ready-button");
        parentNode.innerHTML = this.loadGameMenu();
        this._clickCallback = false;
    }

    loadMenu() {
        return `
			<nav id="sideNavbar" class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container-fluid">
				<!-- Navbar content -->
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" href="#">Tab 1</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">Tab 2</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">Tab 3</a>
					</li>
					</ul>
				</div>
				</div>
			</nav>
		`;
    }

    loadGameMenu() {
        return `
			<div id="pong-menu">
				<button 
					type="button" 
					class="btn btn-primary full-white-button extra-btn-class mt-3" 
					data-bs-toggle="modal" 
					data-bs-target="#exampleModal"
				>
					Customize game
				</button>
			
				<div 
					class="modal fade" 
					id="exampleModal" 
					tabindex="-1" 
					aria-labelledby="exampleModalLabel" 
					aria-hidden="true"
				>
					<div class="modal-dialog">
						<div class="modal-content bg-dark text-white">
							<div class="modal-header">
								<h1 
									class="modal-title fs-5" 
									id="exampleModalLabel"
								>
									Pong Game Customization
								</h1>
								<button 
									type="button" 
									class="btn-close btn-close-white" 
									data-bs-dismiss="modal" 
									aria-label="Close"
								></button>
								</div>
								<div class="modal-body">
									<nav class="navbar bg-dark">
										<div class="container-fluid">
											${new ShowSkins().getHtml()}
										</div>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
    }

    getHtml() {
        return this.loadGameMenu();
    }
}

class ShowSkins extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
        this._parentNode = null;
        this._paddleCallback = false;
        this._ballCallback = false;
        this._courtCallback = false;
        this._readyState = false;

        this._observer = new MutationObserver(this.defineCallback.bind(this));
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.onbeforeunload = () => {
            this.removeCallbacks();
        };
    }

    defineCallback() {
        const parentNode = document.getElementById("pong-menu");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.navTabsCallback = (event) => {
            event.preventDefault();
        }

    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        const aList = this._parentNode.querySelectorAll("a");
        if (aList && aList.length && !this._aCallback) {
            this._parentNode.querySelectorAll("a").forEach((a) => {
                a.removeEventListener("a", this.navTabsCallback);
            });
        }
    }

    defineCallback() {
        const parentNode = document.getElementById("pong-skins");
        if (parentNode) {
            this._parentNode = parentNode;
        } else {
            return;
        }

        this.paddleCallback = (event) => {
            event.preventDefault();
            console.log("Paddle tab was clicked!")
        }

        this.ballCallback = (event) => {
            event.preventDefault();
            console.log("Ball tab was clicked!")
        }

        this.courtCallback = (event) => {
            event.preventDefault();
            console.log("Court tab was clicked!")
        }

        const paddle = this._parentNode.querySelector("paddle");
        if (paddle && !this._paddleCallback) {
            this._paddleCallback = true;
            paddle.addEventListener('click', this.paddleCallback);
        }

        const ball = this._parentNode.querySelector("ball");
        if (ball && !this._ballCallback) {
            this._ballCallback = true;
            ball.addEventListener('click', this.ballCallback);
        }

        const court = this._parentNode.querySelector("court");
        if (court && !this._courtCallback) {
            this._courtCallback = true;
            court.addEventListener('click', this.courtCallback);
        }
    }

    removeCallbacks() {
        if (!this._parentNode) {
            return;
        }

        const paddle = this._parentNode.querySelector("paddle");
        if (paddle) {
            this._paddleCallback = true;
            paddle.removeEventListener('click', this.paddleCallback);
        }

        const ball = this._parentNode.querySelector("ball");
        if (ball) {
            this._ballCallback = true;
            ball.removeEventListener('click', this.ballCallback);
        }

        const court = this._parentNode.querySelector("court");
        if (court) {
            this._courtCallback = true;
            court.removeEventListener('click', this.courtCallback);
        }

        this._observer.disconnect();
    }

    loadDOMChanges() {
        const parentNode = document.getElementById("pong-skins");
        parentNode.innerHTML = this.loadSkins();
        this._clickCallback = false;
    }

    loadSkins() {
        return `
			<ul class="nav nav-tabs">
				<li class="nav-item">
					<a class="nav-link active" aria-current="page" id="paddle">Paddle</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" id="ball">Ball</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" id="court">Court</a>
				</li>
				<li class="nav-item">
					<a class="nav-link disabled" aria-disabled="true">Disabled</a>
				</li>
			</ul>
		`;
    }

    getHtml() {
        return this.loadSkins();
    }
}