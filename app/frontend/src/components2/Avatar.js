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
        this.render();
    }

    handleChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.avatar = file;
            this.url = URL.createObjectURL(file);
            this.render();
        }
        this.dispatchEvent(
            new CustomEvent("avatarChanged", {
                detail: this.avatar,
                bubbles: true,
            })
        );
    }

    render() {
        this.innerHTML = this.getHtml();
    }

    getHtml() {
        return `
			<figure>
				<input
					type="file"
					id="avatar"
					name="avatar"
					accept="image/png, image/jpeg, image/jpg"
					hidden
				></input>
				<label for="avatar">
				${
                    this.url
                        ? `<img
						src=${this.url}
						alt="Avatar preview"
						width="200"
						height="200"
						class="avatar-border-lg"
						style="border-radius: 50%"
						/>`
                        : `<base-avatar-box size="200"></base-avatar-box>`
                }
				</label>
			</figure>
		`;
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
