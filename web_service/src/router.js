import LandingPage from "./views/LandingPage.js";
import LoginPage from "./views/LoginPage.js";
import Login2FAPage from "./views/Login2FAPage.js";
import Login42Page from "./views/Login42Page.js";
import SignUpPage from "./views/SignUpPage.js";
import CreateProfilePage from "./views/CreateProfilePage.js";
import Create42ProfilePage from "./views/Create42ProfilePage.js";
import NavigationBar from "./views/NavigationBar.js";
import HomePage from "./views/HomePage.js";
import ChangeUserInfo from "./components/ChangeUserInfo.js";
import ChangePassword from "./components/ChangePassword.js";
import WaitingRoom from "./views/WaitingRoom.js";
import Pong from "./views/Pong.js";
import SettingsPage from "./views/SettingsPage.js";
import { Game1, Game2 } from "./components/Games.js";
import { GameMenuOptions, MultiplayerOptions, SinglePlayerOptions, TournamentOptions } from "./components/GameOptions.js";

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
        path: "/login-2FA",
        view: Login2FAPage,
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
        view: CreateProfilePage
    },
	{
        path: "/create-profile-42",
        view: Create42ProfilePage
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
						view: [Game1, WaitingRoom]
                    },
                    {
                        path: "/pong/multiplayer/waiting-room/4",
						view: [Game1, WaitingRoom]
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
						view: [WaitingRoom, Game2]
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
                view: SettingsPage,
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
				view: Pong
            },
            {
                path: "/pong/play/single-player/2",
				view: Pong
            },
            {
                path: "/pong/play/multiplayer/2",
				view: Pong
            },
            {
                path: "/pong/play/multiplayer/4",
				view: Pong
            },
			{
                path: "/tic-tac-toe/play/single-player/1"
            },
            {
                path: "/tic-tac-toe/play/single-player/2"
            },
            {
                path: "/tic-tac-toe/play/multiplayer/2"
            },
        ]
    }
];
