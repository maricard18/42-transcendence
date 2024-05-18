export default async function fetchData(endpoint, method, headers = {}, body = null) {
    const fetchOptions = {
        method: method,
        headers: {
            ...headers,
        },
    };

    if (body) {
        fetchOptions.body = body;
    }

    const protocol = window.location.protocol;
    const host = window.location.host;
    const response = await fetch(protocol + "//" + host + endpoint, fetchOptions);

    return response;
}

export function checkEnterButton(functionToBeRun) {
    document.onkeydown = function (event) {
        var keyCode = event
            ? event.which
                ? event.which
                : event.keyCode
            : event.keyCode;
        if (keyCode == 13) {
            event.preventDefault();
            functionToBeRun();
        }
    };
}

export function getPageTitle(path) {
	//TODO update all routes titles
    switch (path) {
        case "/home":
            return "Home";
        case "/home/pong":
            return "Pong Menu";
        case "/home/pong/single-player":
            return "Pong Single Player";
        case "/home/pong/multiplayer":
            return "Pong Multiplayer";
        case "/home/pong/multiplayer/waiting-room/2":
            return "Pong Multiplayer Waiting Room";
        case "/home/pong/multiplayer/waiting-room/4":
            return "Pong Multiplayer Waiting Room";
        case "/home/pong/single-player/tournament":
            return "Pong Single Player Tournament";
        case "/home/pong/play/single-player/1":
            return "Pong Single Player 1 player";
        case "/home/pong/play/single-player/2":
            return "Pong Single Player 2 players";
        case "/home/pong/play/multiplayer/2":
            return "Pong Multiplayer 2 players";
        case "/home/pong/play/multiplayer/4":
            return "Pong Multiplayer 4 players";
        case "/home/settings/account":
            return "Account";
        case "/home/settings/security":
            return "Security";
		case "/home/friends":
			return "Friends";
		case "/home/settings/security":
			return "Security";
		default:
			if (path.startsWith("/home/profile/")) {
				return "Profile";
			} else {
				return "Transcendence"
			}
    }
}
