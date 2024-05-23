import fetchData from "./fetchData";
import {decode, getToken} from "./tokens";
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
		console.debug("Error: failed to get access token");
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
		console.debug("Error: failed to decode token.");
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
        return;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
		console.debug("Error: failed to parse response");
        return;
    }

    const data = {
        username: await transitDecrypt(jsonData["username"]),
        email: await transitDecrypt(jsonData["email"]),
        avatar: null,
        id: user_id,
		is_active: jsonData["is_active"],
		date_joined: jsonData["date_joined"]
    };

    if (jsonData["avatar"]) {
        data["avatar"] = jsonData["avatar"]["link"]
    }

    return data;
}
