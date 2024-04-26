import AbstractView from "./AbstractView";

export default class HomePage extends AbstractView {
    constructor(view) {
        super();
        this._view = view;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="d-flex flex-column flex-md-row  align-items-center justify-content-center justify-content-md-evenly vh-100 row">
                ${await (async () => {
					const htmlArray = await Promise.all(
						this._view.map((view) => view.getHtml())
					);
					return htmlArray.join("");
                })()}
                </div>
            </div>
        `;
    }
}
