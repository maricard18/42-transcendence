import { getToken } from "./tokens";
import fetchData from "./fetchData";

export default async function getUserInfo(setAuthed) {
	const accessToken = await getToken(setAuthed);
    const decodeToken = await decode(accessToken);

    const response = await fetchData(
        "/api/users/" + decodeToken["user_id"] + "/",
        "GET",
        {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    );

    if (!response.ok) {
        console.log("Error while fething user info!");
        return "";
    }

    const jsonData = await response.json();
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
