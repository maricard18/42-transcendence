import { getToken } from "./tokens";
import fetchData from "./fetchData";

export default async function getUserInfo(setAuthed) {
	const accessToken = await getToken(setAuthed);
    const decodeToken = await decode(accessToken);

    const response = await fetchData(
        "/api/users/" + decodeToken["user_id"],
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
	console.log(accessToken);
    return JSON.parse(atob(accessToken.split(".")[1]));
} 	 

//async function decode(accessToken) {
//    const parts = accessToken.split(".");
//    if (parts.length < 2) {
//        throw new Error("Invalid access token format");
//    }
//    const payload = parts[1];
//    if (!isValidBase64(payload)) {
//        throw new Error("Invalid access token payload");
//    }
//    return JSON.parse(atob(payload));
//}

//function isValidBase64(str) {
//    try {
//        atob(str);
//        return true;
//    } catch (err) {
//        return false;
//    }
//}
