import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
	{
        path: "sign-up/",
        element: <SignUpPage />,
    },
	{
        path: "login/",
        element: <LoginPage />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<App />);
