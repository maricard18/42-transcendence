import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage.js";
import Login42Page from "./Login42Page.js";
import SignUpPage from "./SignUpPage";
import CreateProfilePage from "./CreateProfilePage.js";
import NavigationBar from "./NavigationBar.js";
import HomePage from "./HomePage.js";

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
        path: "/login/42",
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
            },
			{
                path: "/",
                view: HomePage,
            },
        ],
    },
];
