import { getToken } from "./tokens";
import fetchData from "./fetchData";

export default async function getUserInfo() {
    const decodeToken = await decode();

    const response = await fetchData(
        "/api/users/" + decodeToken["user_id"],
        "GET",
        {
            "Content-type": "application/json",
            Authorization: "Bearer " + (await getToken()),
        },
    );

    if (!response.ok) {
        console.log("Error while fething user info!");
        return "";
    }

    const jsonData = await response.json();
    console.log(jsonData);
    const data = {
        username: jsonData["username"],
        email: jsonData["email"],
    };

    console.log(data.username, data.email);

    return data;
}

async function decode() {
    const accessToken = await getToken();

    return JSON.parse(atob(accessToken.split(".")[1]));
}
