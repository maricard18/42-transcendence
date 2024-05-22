import AbstractView from "../views/AbstractView";
import Cookies from "js-cookie";
import fetchData from "./fetchData";
import { transitEncrypt } from "../functions/vaultAccess";
import { closeStatusWebsocket, closeWebsocket } from "./websocket";
import { cleanTournamentStorage } from "..";

export async function createToken(formData) {
    const formDataToSend = new FormData();
    formDataToSend.append("grant_type", "password");
    formDataToSend.append("username", await transitEncrypt(formData.username));
    formDataToSend.append("password", await transitEncrypt(formData.password));

    const response = await fetchData(
        "/auth/token",
        "POST",
        null,
        formDataToSend
    );

    if (!response.ok) {
        console.error("Error: failed to create authentication token");
        logout();
        return;
    }

    await setToken(response);
}

export async function setToken(response) {
    try {
		const jsonData = await response.json();
        const accessToken = jsonData["access_token"];
        const refreshToken = jsonData["refresh_token"];
        const expiresIn = Number(jsonData["expires_in"]);
        var time = new Date();
        time.setTime(time.getTime() + expiresIn * 1000);

        Cookies.set("access_token", accessToken, {
            expires: time,
            sameSite: "strict",
            secure: true,
        });
        Cookies.set("refresh_token", refreshToken, {
            sameSite: "strict",
			secure: true,
        });

        AbstractView.authed = true;
    } catch (error) {
        console.error("Error: failed to set Cookies", error);
        logout();
    }
}

export async function refreshToken() {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken || (refreshToken && refreshToken === "undefined")) {
        if (location.pathname.startsWith("/home")) {
            console.error("Error: refresh_token doesn't exist");
            logout();
        }
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("grant_type", "refresh_token");
    formDataToSend.append("refresh_token", refreshToken);

    const response = await fetchData(
        "/auth/token",
        "POST",
        null,
        formDataToSend
    );

    if (!response.ok) {
        console.error("Error: failed to refresh access_token");
        logout();
        return;
    }

    await setToken(response);
}

export async function getToken() {
    const accessToken = Cookies.get("access_token");

    if (accessToken && accessToken !== "undefined") {
        return accessToken;
    } else {
        await refreshToken();
        const newAccessToken = Cookies.get("access_token");
        return newAccessToken;
    }
}

export function decode(accessToken) {
	if (accessToken) {
		return JSON.parse(atob(accessToken.split(".")[1]));
	}

	return null;
}

export function logout() {
    console.log("Logged out, cleaning data")
	closeWebsocket();
	closeStatusWebsocket();
	cleanTournamentStorage(); 	
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    AbstractView.cleanGameData();
    AbstractView.cleanUserData();
    AbstractView.authed = false;
}
