import {decode, getToken, logout} from "./tokens";
import fetchData from "./fetchData";
import {transitDecrypt} from "./vaultAccess";

export default async function getUserInfo(token = null, id = null) {
    let accessToken, decodeToken, jsonData, user_id;

    try {
		if (!token) {
			accessToken = await getToken();
		} else {
			accessToken = token;
		}
    } catch (error) {
        console.log("Error: failed to get access token");
        logout();
        return;
    }

    try {
		if (!id) {
			decodeToken = decode(accessToken);
			user_id = decodeToken["user_id"];
		} else {
			user_id = id;
		}
    } catch (error) {
        console.log("Error: failed to decode token.");
        logout();
        return;
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetchData(
        "/api/users/" + user_id,
        "GET",
        headers
    );

    if (!response.ok) {
        console.log("Error: failed to fetch user data.");
        logout();
        return;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        console.log("Error: failed to parse response");
        logout();
        return;
    }

    const data = {
        username: await transitDecrypt(jsonData["username"]),
        email: await transitDecrypt(jsonData["email"]),
        avatar: null,
        id: user_id,
    };

    if (jsonData["avatar"]) {
        data["avatar"] = jsonData["avatar"]["link"]
    }

    return data;
}
