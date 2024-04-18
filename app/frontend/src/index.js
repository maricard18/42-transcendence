import { routes } from "./views/router";
import "./functions/defineComponents";
import "../static/css/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

const router = async () => {
    const potentialMatches = routes.map((route) => {
		let url = location.pathname;
		if (location.pathname.indexOf("?") >= 0) {
			url = location.pathname.substring(location.pathname.indexOf("?"));
			console.log(url);
		}

        return {
            route: route,
            match: url === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.match);

    if (!match) {
        match = {
            route: routes[0],
        };
    }

    const view = new match.route.view();
    document.querySelector("#app").innerHTML = await view.getHtml();
};

export function navigateTo(url) {
    history.pushState(null, "", url);
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
