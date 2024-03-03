import Cookies from "js-cookie";
import fetchData from "./fetchData";

export async function createToken(userData) {
    const data = {
        grant_type: "password",
        username: userData.username,
        password: userData.password,
    };

    const response = await fetchData("/api/tokens/", "POST", data);
    setToken(response);
}

export async function setToken(response) {
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
        refresh_token: Cookies.get('refresh_token'),
    };

    const response = await fetchData("/api/tokens/", "POST", data);
    setToken(response);
}

export async function getToken() {
    const accessToken = Cookies.get('access_token');

	if (accessToken) {
		console.log("token exists: ", accessToken);
		return accessToken;
	}
	else {
		refreshToken();
		const newAccessToken = Cookies.get('access_token');
		return newAccessToken;
	}
}