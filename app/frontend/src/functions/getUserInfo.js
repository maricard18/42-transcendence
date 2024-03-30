import { getToken, logout } from "./tokens";
import fetchData from "./fetchData";
import { logError } from "./utils";
import { decode } from "./tokens";

export default async function getUserInfo(setAuthed) {
    let accessToken, decodeToken, jsonData;

	try {
        accessToken = await getToken(setAuthed);
    } catch (error) {
        logError("failed to get access token");
		logout(setAuthed);
		return ;
    }

    try {
        decodeToken = decode(accessToken);
    } catch (error) {
        logError("failed to decode token");
        logout(setAuthed);
		return ;
    }

    const response = await fetchData(
        "/api/users/" + decodeToken["user_id"],
        "GET",
        {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    );

    if (!response.ok) {
        logError("failed to fetch user data.");
		logout(setAuthed);
		return ;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        logError("failed to parse response");
        logout(setAuthed);
		return ;
    }

    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
        id: decodeToken["user_id"],
    };

    return data;
}
