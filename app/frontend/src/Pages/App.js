import React from "react";
import { createRoot } from "react-dom/client";
import {
    AuthProvider,
    FormDataProvider,
    UserInfoProvider,
    PreviousLocationProvider,
} from "../components/Context";
import LandingPage from "./LandingPage";
import SignUpPage from "./SignUpPage";
import CreateProfilePage from "./CreateProfilePage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import { Game1, Game2 } from "../components/Games";
import {
    GameMenuOptions,
    SinglePlayerOptions,
    MultiplayerOptions,
    TournamentOptions,
} from "../components/GameOptions";
import { MultiplayerWaitingRoom } from "../components/WaitingRoom";
import ProfilePage from "./ProfilePage";
import Pong from "../components/Pong";
import NavigationBar from "./NavigationBar";
import { IsAuthed, IsNotAuthed } from "../components/Authed";
import ChangeUsername from "../components/ChangeUsername";
import ChangePassword from "../components/ChangePassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../static/css/index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <IsNotAuthed>
                <LandingPage />,
            </IsNotAuthed>
        ),
    },
    {
        path: "/sign-up",
        element: (
            <FormDataProvider>
                <IsNotAuthed>
                    <SignUpPage />,
                </IsNotAuthed>
            </FormDataProvider>
        ),
    },
    {
        path: "/create-profile",
        element: (
            <FormDataProvider>
                <IsNotAuthed>
                    <CreateProfilePage />,
                </IsNotAuthed>
            </FormDataProvider>
        ),
    },
    {
        path: "/login",
        element: (
            <IsNotAuthed>
                <LoginPage />,
            </IsNotAuthed>
        ),
    },
    {
        path: "/menu",
        element: (
            <IsAuthed>
                <UserInfoProvider>
                    <PreviousLocationProvider>
                        <NavigationBar />
                    </PreviousLocationProvider>
                </UserInfoProvider>
            </IsAuthed>
        ),
        children: [
            {
                path: "",
                element: <HomePage />,
                children: [
                    {
                        path: "",
                        element: (
                            <>
                                <Game1 />
                                <Game2 />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/options",
                        element: (
                            <>
                                <Game1 />
                                <GameMenuOptions />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/single-player",
                        element: (
                            <>
                                <Game1 />
                                <SinglePlayerOptions />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/multiplayer",
                        element: (
                            <>
                                <Game1 />
                                <MultiplayerOptions />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/multiplayer/waiting-room/2",
                        element: (
                            <>
                                <Game1 />
                                <MultiplayerWaitingRoom />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/multiplayer/waiting-room/4",
                        element: (
                            <>
                                <Game1 />
                                <MultiplayerWaitingRoom />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/single-player-tournament",
                        element: (
                            <>
                                <Game1 />
                                <TournamentOptions />
                            </>
                        ),
                    },
                    {
                        path: "pong-game/multiplayer-tournament",
                        element: (
                            <>
                                <Game1 />
                                <TournamentOptions />
                            </>
                        ),
                    },
                ],
            },
            {
                path: "profile",
                element: <ProfilePage />,
                children: [
                    {
                        path: "username",
                        element: <ChangeUsername />,
                    },
                    {
                        path: "password",
                        element: <ChangePassword />,
                    },
                ],
            },
			{
				path: "pong-game/play/single-player/1",
				element: <Pong />,
			},
			{
				path: "pong-game/play/single-player/2",
				element: <Pong />,
			},
            {
                path: "pong-game/play",
                element: <Pong />,
            },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<App />);
