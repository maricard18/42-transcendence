import { navigateTo } from "..";
import "../../static/css/Buttons.css";

export class NavButton extends HTMLElement {
    constructor() {
        super();
		this.addEventListener("click", this.handleClickTo.bind(this));
    }

    connectedCallback() {
        this.render();
    }

    handleClickTo() {
		const page = this.getAttribute("page");
		if (page.startsWith('http://') || page.startsWith('https://')) {
			console.log("42 Auth:", page);
			window.location.href = page;
		} else {
			navigateTo(page);
		}
	}

    render() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute(
            "class",
            `btn btn-primary ${this.getAttribute("class")}`
        );
        button.textContent = `${this.getAttribute("value")}`;
        this.appendChild(button);
    }
}

customElements.define("nav-button", NavButton);

export class SubmitButton extends HTMLElement {
	constructor() {
		super();
		this.addEventListener("click", this.handleClick.bind(this));
	}

	connectedCallback() {
		this.render();
	}

	handleClick() {
		// handle click to send submission
	}

	render() {
		const button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute(
			"class",
			`btn btn-primary ${this.getAttribute("class")}`
		);
		button.textContent = `${this.getAttribute("value")}`;
		button.addEventListener("click", this.handleClick.bind(this));
		this.appendChild(button);
	}
}

customElements.define("submit-button", SubmitButton);

export class NavLink extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const href = this.getAttribute("href");
        const className = this.getAttribute("class");
        const value = this.getAttribute("value");
    
        this.innerHTML = `<a href="${href}" class="${className}">${value}</a>`;
    }
}

customElements.define("nav-link", NavLink);
