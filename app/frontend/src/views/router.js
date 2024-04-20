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
                        view: [Game1, Game2],
                    },
                    {
                        path: "/pong-game",
                        view: [Game1, GameMenuOptions],
                    },
                    {
                        path: "/pong-game/single-player",
                        view: [Game1, SinglePlayerOptions],
                    },
                    {
                        path: "/pong-game/multiplayer",
                        view: [Game1, MultiplayerOptions],
                    },
                    {
                        path: "/pong-game/multiplayer/waiting-room/2",
                    },
                    {
                        path: "/pong-game/multiplayer/waiting-room/2",
                    },
                    {
                        path: "/pong-game/single-player/tournament",
                        view: [Game1, TournamentOptions],
                    },
                    {
                        path: "/pong-game/multiplayer/tournament",
                        view: [Game1, TournamentOptions],
                    },
                ],
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
                    },
                ],
            },
            {
                path: "/pong-game/play/single-player/1",
            },
            {
                path: "/pong-game/play/single-player/2",
            },
            {
                path: "/pong-game/play/multiplayer/2",
            },
            {
                path: "/pong-game/play/multiplayer/4",
            },
            {
                path: "/pong-game/play",
            },
        ],
    },
];
