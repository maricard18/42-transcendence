import LandingPage from "./views/LandingPage.js";
import LoginPage from "./views/LoginPage.js";
import Login2FAPage from "./views/Login2FAPage.js";
import Login42Page from "./views/Login42Page.js";
import SignUpPage from "./views/SignUpPage.js";
import CreateProfilePage from "./views/CreateProfilePage.js";
import Create42ProfilePage from "./views/Create42ProfilePage.js";
import NavigationBar from "./views/NavigationBar.js";
import HomePage from "./views/HomePage.js";
import Account from "./components/Account.js";
import Security from "./components/Security.js";
import WaitingRoom from "./views/WaitingRoom.js";
import Pong from "./views/Pong.js";
import SettingsPage from "./views/SettingsPage.js";
import Tournament, { TournamentMatchmaking } from "./views/Tournament.js";
import { Game1, Game2 } from "./components/Games.js";
import { GameMenuOptions, MultiplayerOptions, SinglePlayerOptions, TournamentOptions } from "./components/GameOptions.js";
import TicTacToe from "./views/TicTacToe.js";

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
                        path: "/pong/tournament",
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
                        path: "/tic-tac-toe/tournament",
                        view: [TournamentOptions, Game2]
                    }
                ]
            },
            {
                path: "/settings",
                view: SettingsPage,
                children: [
                    {
                        path: "/account",
                        view: Account,
                    },
                    {
                        path: "/security",
                        view: Security,
                    }
                ]
            },
			{
                path: "/pong/tournament/creation",
				view: Tournament
            },
			{
                path: "/pong/tournament/matchmaking",
				view: TournamentMatchmaking
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
                path: "/pong/play/tournament/2",
				view: Pong
            },
			{
                path: "/tic-tac-toe/play/single-player/1",
				view: TicTacToe
            },
            {
                path: "/tic-tac-toe/play/single-player/2",
				view: TicTacToe
            },
            {
                path: "/tic-tac-toe/play/multiplayer/2",
				view: TicTacToe
            },
        ]
    }
];
