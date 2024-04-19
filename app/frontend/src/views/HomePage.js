import { navigateTo } from "../index";
import AbstractView from "./AbstractView";

export default class HomePage extends AbstractView {
    constructor(view) {
        super();
        this._view = view; // Corrected assignment
        this.setTitle("Home");
    }

    async getHtml() {
		if (!AbstractView.authed) {
			navigateTo("/");
		}
		
        return `
            <div class="container">
                <div class="
                    d-flex 
                    flex-column 
                    flex-md-row 
                    align-items-center 
                    justify-content-center 
                    justify-content-md-evenly 
                    vh-100
                    row"
                >
                ${await (async () => {
                    if (this._view.length > 1) {
                        const htmlArray = await Promise.all(
                            this._view.map((view) => view.getHtml())
                        );
                        return htmlArray.join("");
                    } else {
                        return await this._view.getHtml();
                    }
                })()}
                </div>
            </div>
        `;
    }
}

