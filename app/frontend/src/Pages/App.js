import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, UserInfoProvider } from "../components/Context";
import LandingPage from "./LandingPage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import PongPage from "./PongPage";
import NavigationBar from "../components/NavigationBar";
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
            },
            {
                path: "pong-game",
                element: <PongPage />,
            },
            {
                path: "profile",
                children: [
                    {
                        path: "username",
                        element: (
                            <ProfilePage>
                                <ChangeUsername />
                            </ProfilePage>
                        ),
                    },
                    {
                        path: "password",
                        element: (
                            <ProfilePage>
                                <ChangePassword />
                            </ProfilePage>
                        ),
                    },
                ],
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
