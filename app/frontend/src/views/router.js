import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage.js";
import Login42Page from "./Login42Page.js";
import SignUpPage from "./SignUpPage";
import CreateProfilePage from "./CreateProfilePage.js";
import NavigationBar from "./NavigationBar.js";
import HomePage from "./HomePage.js";

export const routes = [
    {
        path: "/",
        view: LandingPage
    },
    {
        path: "/login",
        view: LoginPage
    },
    {
        path: "/login-42",
        view: Login42Page
    },
    {
        path: "/sign-up",
        view: SignUpPage
    },
    {
        path: "/create-profile",
        view: CreateProfilePage
    },
    {
        path: "/home",
        view: NavigationBar,
        children: [
            {
                path: "",
                view: HomePage,
				children: [
					{
						path: "",
					},
					{
						path: "/pong-game/options",
					},
					{
						path: "pong-game/single-player",
					},
					{
						path: "pong-game/multiplayer",
					},
					{
						path: "pong-game/multiplayer/waiting-room/2",
					},
					{
						path: "pong-game/multiplayer/waiting-room/2",
					},
					{
						path: "pong-game/single-player-tournament",
					},
					{
						path: "pong-game/multiplayer-tournament",
					}
				]
            },
			{
                path: "/profile",
				children: [
					{
						path: "/username",
					},
					{
						path: "/password",
					}
				]
            },
			{
                path: "pong-game/play/single-player/1",
            },
            {
                path: "pong-game/play/single-player/2",
            },
            {
                path: "pong-game/play/multiplayer/2",
            },
            {
                path: "pong-game/play/multiplayer/4",
            },
            {
                path: "pong-game/play",
            }
        ]
    }
];
