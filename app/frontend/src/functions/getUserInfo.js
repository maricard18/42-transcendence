import { getToken } from "./tokens";
import fetchData from "./fetchData";

export default async function getUserInfo(setAuthed) {
    let accessToken, decodeToken, jsonData;

	try {
        accessToken = await getToken(setAuthed);
    } catch (error) {
        console.log("Error getting token: ", error);
        return null;
    }

    try {
        decodeToken = await decode(accessToken);
    } catch (error) {
        console.log("Error decoding token: ", error);
        return null;
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
        console.log("Error: error while fetching user data");
		return null;
    }

    try {
        jsonData = await response.json();
    } catch (error) {
        console.log("Error parsing response: ", error);
        return null;
    }

    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
        id: decodeToken["user_id"],
    };

    return data;
}

async function decode(accessToken) {
    return JSON.parse(atob(accessToken.split(".")[1]));
}
