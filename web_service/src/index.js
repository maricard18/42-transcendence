import AbstractView from "./views/AbstractView";
import { routes } from "./router";
import { getToken } from "./functions/tokens";
import { closeWebsocket, connectOnlineStatusWebsocket } from "./functions/websocket";
import "./functions/defineComponents";
import "../static/css/index.css";

const router = async () => {
    const url = location.pathname;
    let matches = findMatch(url, routes);

	if (matches === -1) {
		return ;
	}

    if (hasWebSocket(matches)) {
        closeWebsocket();
    }

    if (!await hasPermission(matches)) {
        return;
    }

	if (!AbstractView.statusWsCreated) {
		connectOnlineStatusWebsocket();
	}

    var view = [];
    if (matches.length > 1) {
        for (let i = matches.length - 1; i >= 0; i--) {
            const match = matches[i];

            if (Array.isArray(match.view)) {
                if (i === matches.length - 1) {
                    view = match.view.map((viewClass) => new viewClass());
                } else {
                    view = match.view.map((viewClass) => new viewClass(view));
                }
            } else {
                if (i === matches.length - 1) {
                    view = new match.view();
                } else {
                    view = new match.view(view);
                }
            }
        }
    } else {
        view = new matches[0].view();
    }

    document.querySelector("#app").innerHTML = await view.getHtml();
};

function findMatch(url, routes, previousMatches = []) {
	const regex = /^\d+$/;
    let longestMatch = -1;
    let index = -1;

    for (let i in routes) {
        const urlToCheck = routes[i].path;
        const urlExists = url.startsWith(urlToCheck);

        if (urlExists && urlToCheck.length > longestMatch) {
            index = i;
            longestMatch = urlToCheck.length;
        }
    }

    if (index > -1) {
        const matchedRoute = routes[index];
        const newUrl = url.slice(matchedRoute.path.length);
        previousMatches.push({
            path: matchedRoute.path,
            view: matchedRoute.view,
        });

        if (matchedRoute.children) {
			return findMatch(newUrl, matchedRoute.children, previousMatches);
        } else {
			if (previousMatches[previousMatches.length - 1].path === "/profile/" && regex.test(newUrl)) {
				previousMatches[previousMatches.length - 1].path += newUrl;
				return previousMatches;
			}

			if (newUrl.length > 0) {
				console.error(`Error: Location ${location.pathname} not found`);
				navigateTo("/home");
				return -1;
			}
            
			return previousMatches;
        }
    } else {
		if (url.length > 0) {
			console.error(`Error: Location ${location.pathname} not found`);
			navigateTo("/home");
			return -1;
		}
        if (previousMatches) {
            return previousMatches;
        }
    }

    return null;
}

async function hasPermission(matches) {
    let fullUrl = "";
    matches.forEach((route) => fullUrl += route.path);
    cleanData(fullUrl);

    const baseUrl = matches[0].path;
    const accessToken = await getToken(AbstractView.authed);

    if (accessToken) {
        AbstractView.authed = true;
    } else {
        AbstractView.authed = false;
    }
	
	const previousLocation = localStorage.getItem("previous_location");

    if (baseUrl === "/home" && !AbstractView.authed) {
        navigateTo("/");
        return false;
    } else if (localStorage.getItem("previous_location") &&
        baseUrl === "/login-42" && AbstractView.authed) {
        return true;
    } else if (!previousLocation && baseUrl === "/create-profile-42" && AbstractView.authed) {
        return true;
    } else if (baseUrl !== "/home" && AbstractView.authed) {
        navigateTo("/home");
        return false;
    }

    return true;
}

function hasWebSocket(matches) {
    let fullUrl = "";
    matches.forEach((route) => fullUrl += route.path);

    if (fullUrl !== "/home/pong/play/multiplayer/2" &&
        fullUrl !== "/home/pong/play/multiplayer/4" &&
        fullUrl !== "/home/tic-tac-toe/play/multiplayer/2" &&
        (AbstractView.previousLocation === "/home/pong/multiplayer/waiting-room/2" ||
		AbstractView.previousLocation === "/home/pong/multiplayer/waiting-room/4" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/multiplayer/waiting-room/2" ||
		AbstractView.previousLocation === "/home/pong/play/multiplayer/2" ||
		AbstractView.previousLocation === "/home/pong/play/multiplayer/4" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/play/multiplayer/2")) {
        console.log("User has a websocket open!")
        return true;
    } else {
        return false;
    }
}

function cleanData(location) {
	if ((location && location.startsWith("/home/pong/play/multiplayer") &&
		location.startsWith("/home/tic-tac-toe/play/multiplayer")) &&
		(!localStorage.getItem("previous_location") ||
		(!localStorage.getItem("previous_location").includes("waiting-room")))) {
		localStorage.removeItem("game_status");
	} else if (location && !location.startsWith("/home/pong/play/multiplayer") &&
		!location.startsWith("/home/tic-tac-toe/play/multiplayer")) {
		localStorage.removeItem("game_status");
	}

	if (location !== "/home/pong/play/tournament/2" && 
		location !== "/home/pong/tournament/matchmaking" &&
		location !== "/home/tic-tac-toe/play/tournament/2" && 
		location !== "/home/tic-tac-toe/tournament/matchmaking") {
		cleanTournamentStorage();
	}
}

export function cleanTournamentStorage() {
	localStorage.removeItem("tournament");
	localStorage.removeItem("match1");
	localStorage.removeItem("match2");
	localStorage.removeItem("match3");
	localStorage.removeItem("user1-name");
	localStorage.removeItem("user2-name");
	localStorage.removeItem("user3-name");
	localStorage.removeItem("user4-name");
	localStorage.removeItem("user1-image");
	localStorage.removeItem("user2-image");
	localStorage.removeItem("user3-image");
	localStorage.removeItem("user4-image");
}

export async function navigateTo(url) {
    history.pushState(null, "", url);
    await router();
}

window.addEventListener("popstate", async () => {
	cleanTournamentStorage();

	if (AbstractView.previousLocation === "/home/pong/play/single-player/1" ||
		AbstractView.previousLocation === "/home/pong/play/single-player/2" ||
		AbstractView.previousLocation === "/home/pong/play/multiplayer/2" ||
		AbstractView.previousLocation === "/home/pong/play/multiplayer/4" ||
		AbstractView.previousLocation === "/home/pong/play/tournament/2" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/play/single-player/1" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/play/single-player/2" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/play/multiplayer/2" ||
		AbstractView.previousLocation === "/home/tic-tac-toe/play/tournament/2") {
		localStorage.removeItem("game_status");
	}
	
	await router();
});

document.addEventListener("DOMContentLoaded", async () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("a")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    await router();
});
