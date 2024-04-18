import { getToken, logout } from "./tokens";
import fetchData from "./fetchData";
import { decode } from "./tokens";

export default async function getUserInfo(authed) {
    let accessToken, decodeToken, jsonData;

    try {
        accessToken = await getToken(authed);
    } catch (error) {
        console.log("Error: failed to get access token");
        logout(authed);
        return;
    }

    try {
        decodeToken = decode(accessToken);
    } catch (error) {
        console.log("Error: failed to decode token.");
        logout(authed);
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
        logout(authed);
        return;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        console.log("Error: failed to parse response");
        logout(authed);
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
