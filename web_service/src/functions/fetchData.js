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

	try {
		const response = await fetch(protocol + "//" + host + endpoint, fetchOptions);

		return response;
	} catch (error) {
		return null;
	}
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
            return "Pong Waiting Room";
        case "/home/pong/multiplayer/waiting-room/4":
            return "Pong Waiting Room";
		case "/home/pong/tournament":
			return "Pong Tournament";
		case "/home/tic-tac-toe":
			return "Tic Tac Toe Menu";
		case "/home/tic-tac-toe/single-player":
			return "Tic Tac Toe Single Player";
		case "/home/tic-tac-toe/multiplayer":
			return "Tic Tac Toe Multiplayer";
		case "/home/tic-tac-toe/multiplayer/waiting-room/2":
			return "Tic Tac Toe Waiting Room";
		case "/home/tic-tac-toe/tournament":
			return "Tic Tac Toe Tournament";
        case "/home/settings/account":
            return "Account";
        case "/home/settings/security":
            return "Security";
		case "/home/friends":
			return "Friends";
		case "/home/pong/tournament/creation":
			return "Tournament Creation";
		case "/home/pong/tournament/matchmaking":
			return "Tournament Matchmaking";
		case "/home/pong/play/single-player/1":
			return "Pong";
		case "/home/pong/play/single-player/2":
			return "Pong";
		case "/home/pong/play/multiplayer/2":
			return "Pong";
		case "/home/pong/play/multiplayer/4":
			return "Pong";
		case "/home/pong/play/tournament/2":
			return "Pong";
		case "/home/tic-tac-toe/tournament/creation":
			return "Tournament Creation";
		case "/home/tic-tac-toe/tournament/matchmaking":
			return "Tournament Matchmaking";
		case "/home/tic-tac-toe/play/single-player/2":
			return "Tic Tac Toe";
		case "/home/tic-tac-toe/play/multiplayer/2":
			return "Tic Tac Toe";
		case "/home/tic-tac-toe/play/tournament/2":
			return "Tic Tac Toe";
		default:
			if (path.startsWith("/home/profile/")) {
				return "Profile";
			} else {
				return "Transcendence"
			}
    }
}
