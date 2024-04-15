import "../../static/css/Buttons.css";

export class NavButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    handleClickTo() {
        console.log(`Navigating to ${this.getAttribute("page")}`);
        const page = this.getAttribute("page");
        window.location.href = page;
    }

    render() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute(
            "class",
            `btn btn-primary ${this.getAttribute("class")}`
        );
        button.textContent = `${this.getAttribute("value")}`;
        button.addEventListener("click", this.handleClickTo.bind(this));
        this.appendChild(button);
    }
}

customElements.define("nav-button", NavButton);

export class NavLink extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.handleClick.bind(this));
    }

    connectedCallback() {
        this.render();
    }

    handleClick() {
        const href = this.getAttribute("href");
        history.pushState(null, "", href);
    }

    render() {
        this.innerHTML = `<a href="${this.getAttribute(
            "href"
        )}" class="${this.getAttribute("class")}">${this.getAttribute(
            "value"
        )}</a>`;
    }
}

customElements.define("nav-link", NavLink);
