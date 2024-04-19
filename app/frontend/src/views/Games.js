import AbstractView from "./AbstractView";

export class Game1 extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        this._callbackRunned = false;

        //this.observer = new MutationObserver(this.loadCallbacks.bind(this));
        //this.observer.observe(document.body, {
        //	childList: true,
        //	subtree: true,
        //});

        //window.onbeforeunload = () => {
        //    this.removeCallbacks();
        //};
    }

    //loadCallbacks() {
	//	if (this._callbackRunned) {
	//		return ;
	//	}

	//	this.handleGameClick = (event) => {
	//		event.preventDefault();
    //        console.log("here");
	//		const a = document.querySelector("a");
	//		a.remove();
    //    };

    //    const a = document.querySelector("a");
	//	if (a) {
	//		this._callbackRunned = true;
	//		a.addEventListener("click", this.handleGameClick);
	//	}
    //}

    //removeCallbacks() {
    //    const a = document.querySelector("a");
    //    if (a) {
    //        a.removeEventListener("click", this.handleGameClick);
    //    }

    //    this._observer.disconnect();
    //}

    async getHtml() {
        return `
			<div class="d-flex flex-column col-md-6">
				<div class="p-3 p-lg-5 pd-xl-0">
					<a
						href="/home/pong-game"
					>
						<img
							class="square game"
							src="/static/images/pong.png"
						/>
					</a>
				</div>
			</div>
        `;
    }
}

export class Game2 extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        return `
			<div class="d-flex flex-column col-md-6">
				<div class="p-3 p-lg-5 pd-xl-0">
					<img
						class="square game"
						src="/static/images/tictactoe.png"
					/>
				</div>
			</div>
        `;
    }
}
