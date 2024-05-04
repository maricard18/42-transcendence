export class Avatar extends HTMLElement {
    constructor() {
        super();
		this._inputCallback = false;
        this._clickCallback = false;
        this._avatar = null;

		this._observer = new MutationObserver(() => {
			const input = this.querySelector("input");
			if (input && !this._inputCallback) {
				this._inputCallback = true;
				input.addEventListener("input", this.handleChange.bind(this));
			}

            const button = this.querySelector("button");
            if (button && !this._clickCallback) {
                this._clickCallback = true;
                button.addEventListener("remove-avatar", this.removeAvatar.bind(this));
            }
        });

        this._observer.observe(this, {
            attributes: true,
            childList: true,
            subtree: true,
        });

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

	disconnectedCallback() {
		this._observer.disconnect();
	}

    removeAvatar(event) {
        const label = this.querySelector("label");
        const avatar = document.createElement("base-avatar-box");
        const img = this.querySelector("img");
        img.remove();
        event.target.remove();
        this._clickCallback = false;
        avatar.setAttribute("size", "200");
        label.appendChild(avatar);
    }

    handleChange(event) {
        const file = event.target.files[0];
		event.target.value = null;

        if (file) {
            const validFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!validFileTypes.includes(file.type)) {
                this.dispatchEvent(
                    new CustomEvent("avatar-change", {
                        detail: false,
                        bubbles: true,
                    })
                );
                return;
            }

            this.avatar = file;
            this.url = URL.createObjectURL(file);

            const avatarBox = this.querySelector("base-avatar-box");
            if (avatarBox) {
                avatarBox.remove();
                const label = this.querySelector("label");
                const img = document.createElement("img");
                img.setAttribute("src", this._url);
                img.setAttribute("alt", "Avatar Preview");
                img.setAttribute("width", "200");
                img.setAttribute("height", "200");
                img.setAttribute("class", "white-border-lg");
                img.setAttribute("style", "border-radius: 50%");
                label.appendChild(img);

				const figure = this.querySelector("figure");
                const button = document.createElement("button");
                button.setAttribute("id", "remove-avatar");
                button.setAttribute("type", "button");
                button.setAttribute("class", "btn-close align-itens-bottom");
                button.setAttribute("aria-label", "Close");
                button.style.position = "absolute";
                button.style.bottom = "10px";
                button.style.right = "0";
                button.style.backgroundColor = "white";
                figure.appendChild(button);

                this.dispatchEvent(
                    new CustomEvent("avatar-change", {
                        detail: file,
                        bubbles: true,
                    })
                );
            } else {
                const img = this.querySelector("img");
                img.setAttribute("src", this._url);
                this.dispatchEvent(
                    new CustomEvent("avatar-change", {
                        detail: file,
                        bubbles: true,
                    })
                );
            }
        }
    }

    getHtml() {
        const figure = document.createElement("figure");
		figure.style.position = "relative";

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("id", "avatar");
        input.setAttribute("name", "avatar");
        input.setAttribute("accept", "image/png, image/jpeg, image/jpg, image/webp");
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
            img.setAttribute("class", "white-border-lg");
            img.setAttribute("style", "border-radius: 50%");
            label.appendChild(img);

            const button = document.createElement("button");
            button.setAttribute("id", "remove-avatar");
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn-close align-itens-bottom");
            button.setAttribute("aria-label", "Close");
            button.style.position = "absolute";
            button.style.bottom = "10px";
            button.style.right = "0";
            button.style.backgroundColor = "white";
            figure.appendChild(button);
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
        const template = this.getAttribute("template")
            ? this.getAttribute("template")
            : "";

        return `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width=${this.getAttribute("size")}
				height=${this.getAttribute("size")}
				fill="white"
				class="bi bi-person-circle avatar ${template}"
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
