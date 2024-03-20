import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "../components/AuthContext";
import LandingPage from "./LandingPage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import PongPage from "./PongPage";
import NavigationBar from "../components/NavigationBar";
import IsAuthed from "../components/IsAuthed";
import ChangeUsername from "../components/ChangeUsername";
import ChangePassword from "../components/ChangePassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../static/css/index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/sign-up",
        element: <SignUpPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/menu",
        element: (
            <IsAuthed>
                <NavigationBar />
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
                path: "profile/username",
                element: <ProfilePage><ChangeUsername /></ProfilePage>,
            },
			{
                path: "profile/password",
                element: <ProfilePage><ChangePassword /></ProfilePage>,
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
