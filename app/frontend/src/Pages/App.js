import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, UserInfoProvider } from "../components/Context";
import LandingPage from "./LandingPage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import { Game1, Game2 } from "../components/Games";
import {
    GameMenuOptions,
    SinglePlayerOptions,
    MultiplayerOptions,
    CreateJoinOptions,
} from "../components/Options";
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
            <IsNotAuthed>
                <SignUpPage />,
            </IsNotAuthed>
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
                    <NavigationBar />
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
