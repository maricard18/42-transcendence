import "../../static/css/Inputs.css";

export class Input extends HTMLElement {
    constructor() {
        super();
		this.addEventListener("input", this.handleChange.bind(this));
    }

    connectedCallback() {
        this.getHtml();
    }

    handleChange(event) {
		const value = event.target.value;
		const id = this.getAttribute("id");
		this.setAttribute("value", value);
		this.querySelector("input").setAttribute("value", value);
		this.dispatchEvent(
			new CustomEvent("inputChanged", { detail: { id, value }, bubbles: true })
		);
	}
	

    getHtml() {
		const div = document.createElement("div");
        div.setAttribute("class", "justify-content-center mb-3");
        this.appendChild(div);
        const input = document.createElement("input");
        input.setAttribute("id", this.getAttribute("id"));
        input.setAttribute("type", this.getAttribute("type"));
        input.setAttribute(
            "class",
            `form-control primary-form ${this.getAttribute("template")}`
        );
        input.setAttribute("placeholder", this.getAttribute("placeholder"));
        input.setAttribute("value", this.getAttribute("value"));
        this.appendChild(input);
    }
}
