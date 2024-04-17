export class CheckIcon extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.getHtml();
    }

    getHtml() {
		const div = document.createElement('div');
		div.innerHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				class="bi bi-check2"
				viewBox="0 0 16 16"
			>
				<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
			</svg>
		`;
		this.appendChild(div);
    }
}

customElements.define("check-icon", CheckIcon);

export class CloseIcon extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.getHtml();
	}

	getHtml() {
		const div = document.createElement('div');
		div.innerHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				class="bi bi-x"
				viewBox="0 0 16 16"
			>
				<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
			</svg>
		`;
		this.appendChild(div);
	}
}

customElements.define("close-icon", CloseIcon);

export class LoadingIcon extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.getHtml();
    }

    getHtml() {
		const div = document.createElement('div');
		div.setAttribute("class", "center");
		div.innerHTML = `
			<div
				class="spinner-border ms-3 mt-2"
				style="width: ${this.getAttribute("size")}; height: ${this.getAttribute("size")};"
				role="status"
			>
				<span class="visually-hidden">Loading...</span>
			</div>
		`;
		this.appendChild(div);
	}
}

customElements.define("loading-icon", LoadingIcon);