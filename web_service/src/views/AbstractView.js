export default class AbstractView {
    static authed = false;
    static userQueue = {};
    static userData = {};
    static userReadyList = {};
    static friendships = [];
    static statusWsCreated = false;
    static gameWsCreated = false;
    static wsConnectionStarted = false;
    static gameOver = null;
    static previousLocation = null;
    static has2FA = null;
    static tokens = null;
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

    constructor() {
    }

    static cleanGameData() {
        this.userQueue = {};
        this.userData = {};
        this.userReadyList = {};
        this.gameWsCreated = false;
        this.wsConnectionStarted = false;
        this.previousLocation = null;
        this.gameOver = null;
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
