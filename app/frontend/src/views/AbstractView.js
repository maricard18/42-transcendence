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

	static cleanGameData() {
		this.userQueue = {};
		this.userData = {};   
		this.userReadyList = {};
		this.wsCreated = false;
		this.wsConnectionStarted = false;
		this.previousLocation = null;
	}

	static cleanUserData() {
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
