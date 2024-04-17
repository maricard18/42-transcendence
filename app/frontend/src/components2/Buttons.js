import { navigateTo } from "../index.js";
import "../../static/css/Buttons.css";

export class NavButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.handleClickTo.bind(this));
    }

    connectedCallback() {
        this.getHtml();
    }

    handleClickTo() {
        const page = this.getAttribute("page");
        if (page.startsWith("http://") || page.startsWith("https://")) {
            console.log("42 Auth:", page);
            window.location.href = page;
        } else {
            navigateTo(page);
        }
    }

    getHtml() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute(
            "class",
            `btn btn-primary ${this.getAttribute("template")}`
        );
        button.textContent = `${this.getAttribute("value")}`;
        this.appendChild(button);
    }
}

export class SubmitButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.handleClick.bind(this));
    }

    connectedCallback() {
        this.getHtml();
    }

    handleClick(e) {
        e.preventDefault();
        this.dispatchEvent(
            new CustomEvent("buttonClicked", {
                detail: true,
                bubbles: true,
            })
        );
    }

    getHtml() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute(
            "class",
            `btn btn-primary ${this.getAttribute("template")}`
        );
        button.textContent = `${this.getAttribute("value")}`;
        this.appendChild(button);
    }
}

export class NavLink extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.getHtml();
    }

    getHtml() {
        const href = this.getAttribute("href");
        const className = this.getAttribute("template");
        const value = this.getAttribute("value");

        this.innerHTML = `<a href="${href}" class="${className}">${value}</a>`;
    }
}
