import { getToken, logout } from "./tokens";
import fetchData from "./fetchData";
import { decode } from "./tokens";

export default async function getUserInfo(setAuthed) {
    let accessToken, decodeToken, jsonData;

    try {
        accessToken = await getToken(setAuthed);
    } catch (error) {
        console.log("Error: failed to get access token");
        logout(setAuthed);
        return;
    }

    try {
        decodeToken = decode(accessToken);
    } catch (error) {
        console.log("Error: failed to decode token.");
        logout(setAuthed);
        return;
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
        console.log("Error: failed to fetch user data.");
        logout(setAuthed);
        return;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        console.log("Error: failed to parse response");
        logout(setAuthed);
        return;
    }

    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
        avatar: null,
        id: decodeToken["user_id"],
    };

    if (jsonData["avatar"]) {
		data["avatar"] = jsonData["avatar"]["link"]
	}

    return data;
}
