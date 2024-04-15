import "bootstrap/dist/css/bootstrap.css";

export class Input extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    handleChange() {
        console.log("Value changed!");
    }

    render() {
		const div = document.createElement("div");
		div.setAttribute("class", "justify-content-center mb-3");
		this.appendChild(div);
		const input = document.createElement("input");
		input.setAttribute("type", this.getAttribute("type"));
		input.setAttribute("class", `form-control primary-form ${this.getAttribute("class")}`);
		input.setAttribute("placeholder", this.getAttribute("placeholder"));
		input.addEventListener("input", this.handleChange.bind(this));
		input.setAttribute("value", this.getAttribute("value"));
        this.appendChild(input);
    }
}

customElements.define("input-box", Input);