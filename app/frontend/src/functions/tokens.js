import Cookies from "js-cookie";
import fetchData from "./fetchData";
import { logError } from "./utils";

export async function createToken(userData, setAuthed) {
    const data = {
        grant_type: "password",
        username: userData.username,
        password: userData.password,
    };

    const response = await fetchData(
        "/api/tokens",
        "POST",
        { "Content-type": "application/json" },
        data
    );

    if (!response.ok) {
        logError("failed to create authentication token.");
        return false;
    }

    const success = await setToken(response, setAuthed);
    return success;
}

export async function setToken(response, setAuthed) {
    try {
        const jsonData = await response.json();
        const accessToken = jsonData["access_token"];
        const refreshToken = jsonData["refresh_token"];
        const expiresIn = Number(jsonData["expires_in"]);
        var time = new Date();
        time.setTime(time.getTime() + expiresIn * 1000);

        Cookies.set("access_token", accessToken, {
            expires: time,
            sameSite: "None",
            secure: true,
        });
        Cookies.set("refresh_token", refreshToken, {
            sameSite: "None",
            secure: true,
        });

        setAuthed(true);
        return true;
    } catch (error) {
        logError("failed to set Cookies -> ", error);
        return false;
    }
}

export async function refreshToken(setAuthed) {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
        logError("refresh_token doesn't exist.");
        return false;
    }

    const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    };

    const response = await fetchData(
        "/api/tokens",
        "POST",
        { "Content-type": "application/json" },
        data
    );

    if (!response.ok) {
        logError("failed to refresh access_token.");
        return false;
    }

    const success = await setToken(response, setAuthed);
    return success;
}

export async function getToken(setAuthed) {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
        return accessToken;
    } else {
        const success = await refreshToken(setAuthed);

        if (!success) {
            return null;
        }

        const newAccessToken = Cookies.get("access_token");
        return newAccessToken;
    }
}

export function hasToken() {
    const accessToken = Cookies.get("access_token");
	//! validate access token
	//! Error: when there is an access_token but is no longer valid

    if (accessToken) {
        return true;
    }

    return false;
}

export function logout(setAuthed) {
    setAuthed(false);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
}
