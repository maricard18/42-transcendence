export class Avatar extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("input", this.handleChange.bind(this));
        this._avatar = null;

        const avatar = this.getAttribute("avatar");
        if (avatar) {
            this._url = avatar;
        } else {
            this._url = null;
        }
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    connectedCallback() {
        this.innerHTML = this.getHtml();
    }

    handleChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.avatar = file;
            this.url = URL.createObjectURL(file);

            const avatar = this.querySelector("base-avatar-box");
            if (avatar) {
                avatar.remove();
                const label = document.querySelector("label");
                const img = document.createElement("img");
                img.setAttribute("src", this._url);
                img.setAttribute("alt", "Avatar Preview");
                img.setAttribute("width", "200");
                img.setAttribute("height", "200");
                img.setAttribute("class", "avatar-border-lg");
                img.setAttribute("style", "border-radius: 50%");
                label.appendChild(img);
            } else {
                const img = document.querySelector("img");
                img.setAttribute("src", this._url);
            }
        }
    }

    getHtml() {
        const figure = document.createElement("figure");

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("id", "avatar");
        input.setAttribute("name", "avatar");
        input.setAttribute("accept", "image/png, image/jpeg, image/jpg");
        input.setAttribute("hidden", "");
        figure.appendChild(input);

        const label = document.createElement("label");
        label.setAttribute("for", "avatar");

        if (this._url) {
            const img = document.createElement("img");
            img.setAttribute("src", this._url);
            img.setAttribute("alt", "Avatar Preview");
            img.setAttribute("width", "200");
            img.setAttribute("height", "200");
            img.setAttribute("class", "avatar-border-lg");
            img.setAttribute("style", "border-radius: 50%");
            label.appendChild(img);
        } else {
            const avatar = document.createElement("base-avatar-box");
            avatar.setAttribute("size", "200");
            label.appendChild(avatar);
        }
        figure.appendChild(label);

        return figure.outerHTML;
    }
}

export class BaseAvatar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = this.getHtml();
    }

    getHtml() {
        return `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width=${this.getAttribute("size")}
				height=${this.getAttribute("size")}
				fill="white"
				class="bi bi-person-circle avatar"
				viewBox="0 0 16 16"
			>
				<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
				<path
					fill="evenodd"
					d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
				/>
			</svg>
		`;
    }
}
