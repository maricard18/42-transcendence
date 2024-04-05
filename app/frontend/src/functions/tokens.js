import Cookies from "js-cookie";
import fetchData from "./fetchData";

export async function createToken(userData, setAuthed) {
    const formDataToSend = new FormData();
    formDataToSend.append("grant_type", "password");
    formDataToSend.append("username", userData.username);
    formDataToSend.append("password", userData.password);

    const response = await fetchData(
        "/api/tokens",
        "POST",
        null,
        formDataToSend
    );

    if (!response.ok) {
        console.log("Error: failed to create authentication token.");
        logout(setAuthed);
        return;
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
            //!  https:// -> sameSite: "None",
            secure: false,
            //! https:// -> secure: true,
        });
        Cookies.set("refresh_token", refreshToken, {
            //!  https:// -> sameSite: "None",
            secure: false,
            //! https:// -> secure: true,
        });

        setAuthed(true);
    } catch (error) {
        console.log("Error: failed to set Cookies");
        logout(setAuthed);
        return;
    }
}

export async function refreshToken(setAuthed) {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
        console.log("Error: refresh_token doesn't exist.");
        logout(setAuthed);
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("grant_type", "refresh_token");
    formDataToSend.append("refresh_token", refreshToken);

    const response = await fetchData(
        "/api/tokens",
        "POST",
        null,
        formDataToSend
    );

    if (!response.ok) {
        console.log("Error: failed to refresh access_token.");
        logout(setAuthed);
        return;
    }

    await setToken(response, setAuthed);
}

export async function getToken(setAuthed) {
    const accessToken = Cookies.get("access_token");

    if (accessToken && (await testToken(accessToken))) {
        return accessToken;
    } else {
        await refreshToken(setAuthed);
        const newAccessToken = Cookies.get("access_token");
        return newAccessToken;
    }
}

export async function testToken(accessToken) {
    let decodeToken;

    try {
        decodeToken = decode(accessToken);
    } catch (error) {
        console.log("Error: failed to decode access token while testing it's validity.");
        return false;
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetchData(
        "/api/users/" + decodeToken["user_id"],
        "GET",
        headers
    );

    if (!response.ok) {
        console.log("Error: access token it's not valid.");
        return false;
    }

    return true;
}

export function decode(accessToken) {
    return JSON.parse(atob(accessToken.split(".")[1]));
}

export function logout(setAuthed) {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setAuthed(false);
}
