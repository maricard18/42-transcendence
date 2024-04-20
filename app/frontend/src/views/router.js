import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage.js";
import Login42Page from "./Login42Page.js";
import SignUpPage from "./SignUpPage";
import CreateProfilePage from "./CreateProfilePage.js";
import NavigationBar from "./NavigationBar.js";
import HomePage from "./HomePage.js";
import ProfilePage from "./ProfilePage.js";
import ChangeUserInfo from "../components2/ChangeUserInfo.js";
import ChangePassword from "../components2/ChangePassword.js";
import { Game1, Game2 } from "../components2/Games.js";
import {
    GameMenuOptions,
    MultiplayerOptions,
    SinglePlayerOptions,
    TournamentOptions,
} from "../components2/GameOptions.js";

export const routes = [
    {
        path: "/",
        view: LandingPage,
    },
    {
        path: "/login",
        view: LoginPage,
    },
    {
        path: "/login-42",
        view: Login42Page,
    },
    {
        path: "/sign-up",
        view: SignUpPage,
    },
    {
        path: "/create-profile",
        view: CreateProfilePage,
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
                        view: [Game1, Game2]
                    },
                    {
                        path: "/pong",
                        view: [Game1, GameMenuOptions]
                    },
                    {
                        path: "/pong/single-player",
                        view: [Game1, SinglePlayerOptions]
                    },
                    {
                        path: "/pong/multiplayer",
                        view: [Game1, MultiplayerOptions]
                    },
                    {
                        path: "/pong/multiplayer/waiting-room/2",
                    },
                    {
                        path: "/pong/multiplayer/waiting-room/4",
                    },
                    {
                        path: "/pong/single-player/tournament",
                        view: [Game1, TournamentOptions]
                    },
                    {
                        path: "/pong/multiplayer/tournament",
                        view: [Game1, TournamentOptions]
                    },
					{
                        path: "/tic-tac-toe",
                        view: [GameMenuOptions, Game2]
                    },
                    {
                        path: "/tic-tac-toe/single-player",
                        view: [SinglePlayerOptions, Game2]
                    },
                    {
                        path: "/tic-tac-toe/multiplayer",
                        view: [MultiplayerOptions, Game2]
                    },
                    {
                        path: "/tic-tac-toe/multiplayer/waiting-room/2",
                    },
                    {
                        path: "/tic-tac-toe/single-player/tournament",
                        view: [TournamentOptions, Game2]
                    },
                    {
                        path: "/tic-tac-toe/multiplayer/tournament",
                        view: [TournamentOptions, Game2]
                    }
                ]
            },
            {
                path: "/profile",
                view: ProfilePage,
                children: [
                    {
                        path: "/username",
                        view: ChangeUserInfo,
                    },
                    {
                        path: "/password",
                        view: ChangePassword,
                    }
                ]
            },
            {
                path: "/pong/play/single-player/1",
            },
            {
                path: "/pong/play/single-player/2",
            },
            {
                path: "/pong/play/multiplayer/2",
            },
            {
                path: "/pong/play/multiplayer/4",
            },
			{
                path: "/tic-tac-toe/play/single-player/1",
            },
            {
                path: "/tic-tac-toe/play/single-player/2",
            },
            {
                path: "/tic-tac-toe/play/multiplayer/2",
            },
        ]
    }
];
