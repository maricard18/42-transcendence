import LandingPage from "./views/LandingPage";
import "bootstrap/dist/css/bootstrap.css";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: LandingPage },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            match: location.pathname === route.path
        };
    });

	console.log(potentialMatches);

    let match = potentialMatches.find(potentialMatch => potentialMatch.match);

    if (!match) {
        match = {
            route: routes[0],
        };
    }

    const view = new match.route.view;

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});