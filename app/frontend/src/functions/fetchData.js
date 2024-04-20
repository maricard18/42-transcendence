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
	
	const host = window.location.host;
    const response = await fetch("http://" + host + endpoint, fetchOptions);

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
    switch (path) {
        case "/home":
            return "Home";
        case "/home/pong-game":
            return "Pong Menu";
        case "/home/pong-game/single-player":
            return "Pong Single Player";
        case "/home/pong-game/multiplayer":
            return "Pong Multiplayer";
		case "/home/pong-game/multiplayer/wating-room/2":
			return "Pong Multiplayer Waiting Room";
		case "/home/pong-game/multiplayer/waiting-room/4":
			return "Pong Multiplayer Waiting Room";
        case "/home/pong-game/single-player/tournament":
            return "Pong Single Player Tournament";
        case "/home/pong-game/multiplayer/tournament":
            return "Pong Multiplayer Tournament";
		case "/pong-game/play/single-player/1":
			return "Pong Single Player 1 player";
		case "/pong-game/play/single-player/2":
			return "Pong Single Player 2 players";
		case "/pong-game/play/multiplayer/2":
			return "Pong Multiplayer 2 players";
		case "/pong-game/play/multiplayer/4":
			return "Pong Multiplayer 4 players";
        case "/home/profile/username":
            return "Profile";
        case "/home/profile/password":
            return "Profile";
    }
}