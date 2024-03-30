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
		logout(setAuthed);
		return ;
    }

    await setToken(response, setAuthed);
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
    } catch (error) {
        logError("failed to set Cookies -> ", error);
		logout(setAuthed);
		return ;
    }
}

export async function refreshToken(setAuthed) {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
        logError("refresh_token doesn't exist.");
        logout(setAuthed);
		return ;
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
        logout(setAuthed);
		return ;
    }

    await setToken(response, setAuthed);
}

export async function getToken(setAuthed) {
    const accessToken = Cookies.get("access_token");

    if (accessToken && await testToken(accessToken)) {
        return accessToken;
    } else {
        await refreshToken(setAuthed);
        const newAccessToken = Cookies.get("access_token");
        return newAccessToken;
    }
}

export async function testToken(accessToken) {
	const response = await fetchData(
        "/api/users",
        "GET",
        {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    );

    if (!response.ok) {
        logError("access token not valid.");
        return false;
    }

	console.log("Access token is valid :)");
	return true;
}

export function logout(setAuthed) {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setAuthed(false);
}
