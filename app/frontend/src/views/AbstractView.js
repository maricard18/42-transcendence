export default class AbstractView {
    constructor() {}

    static authed = false;
	static userQueue = {};
	static userData = {};   
	static userReadyList = {};
	static wsCreated = false;
	static wsConnectionStarted = false;
	static gameOver = false;
	static previousLocation = null;
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

	static clean() {
		this.formData = {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		};
		this.userInfo = {
			id: "",
			username: "",
			email: "",
			avatar: "",
		};
	}

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}
