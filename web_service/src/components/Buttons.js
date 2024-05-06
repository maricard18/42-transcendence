import AbstractView from "../views/AbstractView";
import {navigateTo} from "../index";
import {logout} from "../functions/tokens";

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
        if (this.getAttribute("style")) {
            button.setAttribute("style", this.getAttribute("style"));
        }
        button.textContent = `${this.getAttribute("value")}`;
        this.appendChild(button);
    }
}

export class LogoutButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.handleClickTo.bind(this));
    }

    connectedCallback() {
        this.getHtml();
    }

    handleClickTo() {
        logout(AbstractView.authed); //! check if this works
        navigateTo("/");
    }

    getHtml() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute(
            "class",
            `btn btn-primary ${this.getAttribute("template")}`
        );
        if (this.getAttribute("style")) {
            button.setAttribute("style", this.getAttribute("style"));
        }
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
        if (this.getAttribute("style")) {
            button.setAttribute("style", this.getAttribute("style"));
        }
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
        const template = this.getAttribute("template");
        const value = this.getAttribute("value");

        this.innerHTML = `<a href="${href}" class="${template}">${value}</a>`;
    }
}
