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


//async loadMatchHistory() {		
//	if (!this._matchHistory) {
//		return `
//			<div class="d-flex flex-row justify-content-center align-items-center mt-5">
//				<h1 style="font-size: 50px">No match history</h1>
//			</div>
//		`;
//	}
	
//	const accessToken = await getToken();
	
//	const div = document.createElement("div");
//	div.setAttribute("class", "mt-2");
//	div.id = "match-history-list";
//	div.style.maxHeight = "360px";
//	div.style.overflowY = "auto";
	
//	for (let [index, match] of this._matchHistory.entries()) {
//		console.log(match);
//		const playersInfo = await this.loadUserInfo(accessToken, match.players);
		
//		const matchDiv = document.createElement("div");
//		matchDiv.setAttribute("class", "d-flex flex-column align-items-center match-history mt-3 me-3");
//		matchDiv.id = `match-${index}`;

//		const gamePlayersAndResultsDiv = document.createElement("div");
//		gamePlayersAndResultsDiv.setAttribute("class", "d-flex flex-row justify-content-start w-100 ms-2");

//		const gameImageDiv = document.createElement("div");
//		gameImageDiv.setAttribute("class", "d-flex felx-column align-items-start m-3")
		
//		const gameImage = document.createElement("img");
//		gameImage.setAttribute("alt", "game preview");
//		gameImage.setAttribute("width", "125");
//		gameImage.setAttribute("height", "125");
//		gameImage.setAttribute("src", `/static/images/${match.game === "pong" ? "pong.png" : "tictactoe.png"}`);
//		gameImageDiv.appendChild(gameImage);
		
//		gamePlayersAndResultsDiv.appendChild(gameImageDiv);

//		const playersDiv = document.createElement("div");
//		playersDiv.setAttribute("class", "d-flex flex-column align-items-start ms-3 mt-4");

//		for (let [index, player] of playersInfo.entries()) {
//			const avataraAndUsernameDiv = document.createElement("div");
//			avataraAndUsernameDiv.setAttribute("class", `d-flex flex-row align-items-center mt-1 mb-3`);
//			avataraAndUsernameDiv.id = `player${index + 1}`;
			
//			if (player.avatar) {
//				const img = document.createElement("img");
//				img.setAttribute("class", "white-border-sm");
//				img.setAttribute("alt", "Avatar preview");
//				img.setAttribute("width", "40");
//				img.setAttribute("height", "40");
//				img.setAttribute("style", "border-radius: 50%");
//				img.setAttribute("src", player.avatar);
//				avataraAndUsernameDiv.appendChild(img);
//			} else {
//				const avatar = document.createElement("base-avatar-box");
//				avatar.setAttribute("template", "ms-3");
//				avatar.setAttribute("size", "40");
//				avataraAndUsernameDiv.appendChild(avatar);
//			}
			
//			const username = document.createElement("h3");
//			username.setAttribute("class", "ms-3 mt-2");
//			username.setAttribute("style", "font-size: 20px; font-weight: bold");
//			username.innerText = player.username;
//			avataraAndUsernameDiv.appendChild(username);
			
//			playersDiv.appendChild(avataraAndUsernameDiv);
//		}

//		gamePlayersAndResultsDiv.appendChild(playersDiv);

//		const playerScoresDiv = document.createElement("div");
//		playerScoresDiv.setAttribute("class", "d-flex flex-column align-items-end w-100 mt-4 me-5");

//		for (let [index, player] of playersInfo.entries()) {
//			const scoreDiv = document.createElement("div");
//			scoreDiv.setAttribute("class", `d-flex flex-row align-items-center justify-content-center mt-2`);
//			scoreDiv.id = `score${index + 1}`;

//			const score = document.createElement("h3");
//			score.setAttribute("style", "font-size: 30px; font-weight: bold");
//			score.innerText = match.results[`player_${index + 1}`];;
//			scoreDiv.appendChild(score);
						
//			playerScoresDiv.appendChild(scoreDiv);
//		}

//		gamePlayersAndResultsDiv.appendChild(playerScoresDiv);
		
//		matchDiv.appendChild(gamePlayersAndResultsDiv);
//		div.appendChild(matchDiv);
//	}

//	return div.outerHTML;
//}