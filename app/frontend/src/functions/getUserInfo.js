import { getToken } from "./tokens";

export default async function getUserInfo() {
	const decodeToken = await decode();

	console.log(decodeToken);
}

async function decode() {
	const accessToken = await getToken();

	return JSON.parse(atob(accessToken.split('.')[1]));
}