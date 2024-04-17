export default class AbstractView {
    constructor() {}

	static formData = {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	};

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}
