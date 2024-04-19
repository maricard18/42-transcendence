export default class AbstractView {
    constructor() {}

    static authed = {
        value: false,
    };

    static formData = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    static userInfo = {
        id: "",
        username: "",
        email: "",
        avatar: "",
    };

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}
