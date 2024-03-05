import React from "react";
import { createRoot } from "react-dom/client";
import IsAuthed from "../components/IsAuthed";
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import Layout from "./Layout";
import MenuPage from "./MenuPage";
import PongPage from "./PongPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../static/css/index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
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
                <Layout />
            </IsAuthed>
        ),
        children: [
            {
                path: "",
                element: <MenuPage />,
            },
            {
                path: "pong-game",
                element: <PongPage />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<App />);
