import LandingPage from "./views/LandingPage";
import SignUpPage from "./views/SignUpPage";
import CreateProfilePage from "./views/CreateProfilePage.js";
import "./functions/defineComponents.js";
import "bootstrap/dist/css/bootstrap.css";

const router = async () => {
    const routes = [
        { path: "/", view: LandingPage },
		{ path: "/sign-up", view: SignUpPage },
		{ path: "/create-profile", view: CreateProfilePage },
    ];
	
    const potentialMatches = routes.map(route => {
		return {
            route: route,
            match: location.pathname === route.path
        };
    });
	
    let match = potentialMatches.find(potentialMatch => potentialMatch.match);
	
    if (!match) {
		match = {
			route: routes[0],
        };
    }
	
    const view = new match.route.view;
	
    document.querySelector("#app").innerHTML = await view.getHtml();
};

export function navigateTo(url) {
	history.pushState(null, "", url);
	router();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("a")) {
			e.preventDefault();
			navigateTo(e.target.getAttribute('href'));
        }
    });

    router();
});