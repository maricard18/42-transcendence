import { getToken } from "./tokens";

export var ws;

export async function connectWebsocket(setAuthed, setUserQueue, setUserReadyList) {
    const token = await getToken(setAuthed);
	const host = window.location.host;
    ws = new WebSocket("ws://" + host + "/ws/games/1/queue/2", [
        "Authorization",
        token,
    ]);

    ws.onmessage = (event) => {
        console.log("Message from server: ", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] == "system.grouping") {
                const playerList = jsonData["data"]["players"];
                setUserQueue(playerList);
            }
			
			if (jsonData["type"] == "user.message") {
                const playerReadyList = jsonData["data"]["state"];
                setUserReadyList((prevState) => ({ ...prevState, ...playerReadyList }));
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export function sendMessage(ws, message) {
    ws.send(JSON.stringify(message));
}
