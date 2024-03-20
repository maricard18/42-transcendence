import Cookies from "js-cookie";
import fetchData from "./fetchData";

export async function createToken(userData, setAuthed) {
    const data = {
        grant_type: "password",
        username: userData.username,
        password: userData.password,
    };

    const response = await fetchData(
        "/api/tokens/",
        "POST",
        { "Content-type": "application/json" },
        data
    );

    await setToken(response, setAuthed);
}

export async function setToken(response, setAuthed) {
    setAuthed(true);
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
}

export async function refreshToken() {
    const data = {
        grant_type: "refresh_token",
        refresh_token: Cookies.get("refresh_token"),
    };

    const response = await fetchData(
        "/api/tokens/",
        "POST",
        { "Content-type": "application/json" },
        data
    );

    await setToken(response);
}

export async function getToken() {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
        return accessToken;
    } else {
        await refreshToken();
        const newAccessToken = Cookies.get("access_token");
        return newAccessToken;
    }
}

export function hasToken() {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken) {
		//TODO throw an error
		if (refreshToken) {
			// refreshToken();
			return true;
		}
	}
	
	return true;
	//! return false;
}

export function logout(setAuthed) {
    setAuthed(false);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
}
