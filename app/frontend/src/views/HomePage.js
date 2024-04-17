import AbstractView from "./AbstractView";

export default class HomePage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
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
					<h1>Home Page</h1>
				</div>
			</div>
        `;
    }
}
