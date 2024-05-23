import fetchData from "./fetchData";
import { getToken } from "./tokens";

export default async function logGameResult(game, mode, players) {
	const playersInfoMessage = {};
	const playersResultMessage = {};

	for (let [index, player] of players.entries()) {
		playersInfoMessage[`player_${index + 1}`] = player.info.id;
		playersResultMessage[`player_${index + 1}`] = player.score;
	}

	const gameMessage = {
		game: game,
		type: mode,
		players: playersInfoMessage,
		results: playersResultMessage
	}
            
	const accessToken = await getToken();
	const headers = {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${accessToken}`,
	};

	const response = await fetchData(
		"/api/games",
		"POST",
		headers,
		JSON.stringify(gameMessage)
	);

	if (response.ok) {
		const jsonData = await response.json();
		console.debug("Game Creation Response:", jsonData);
	} else {
		console.debug("Error: failed to create game ", response.status);
	}
}