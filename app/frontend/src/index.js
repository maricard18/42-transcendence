import AbstractView from "./views/AbstractView";
import { routes } from "./views/router";
import { getToken } from "./functions/tokens";
import { closeWebsocket } from "./functions/websocket";
import "./functions/defineComponents";
import "../static/css/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

const router = async () => {
    const url = location.pathname;
    let matches = findMatch(url, routes);

	if (hasWebSocket(matches)) {
		console.log("closing wescoket")
		closeWebsocket();
	}

	if (!await hasPermission(matches)) {
		return ;
	}
    
    let view = [];
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
            return previousMatches;
        }
    } else {
        if (previousMatches) {
            return previousMatches;
        }
    }

    return null;
}

async function hasPermission(matches) {
    let fullUrl = "";
    matches.forEach((route) => fullUrl += route.path);

    const baseUrl = matches[0].path;
    const accessToken = await getToken(AbstractView.authed);

    if (accessToken) {
        AbstractView.authed = true;
    } else {
        AbstractView.authed = false;
    }

    if (baseUrl === "/home" && !AbstractView.authed) {
        navigateTo("/");
		return false;
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
		console.log("user has a websocket open!")
		return true;
	} else {
		return false;
	}
}

export function navigateTo(url) {
    if (url === "-1") {
        history.back();
    } else {
        history.pushState(null, "", url);
    }
    router();
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("a")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    router();
});
