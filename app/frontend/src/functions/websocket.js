import { getToken } from "./tokens";
import { logError } from "./utils";

export var MyWebSocket = {};

export async function connectWebsocket(
    setAuthed,
    setUserQueue,
    setUserReadyList,
    setLoading
) {
    const token = await getToken(setAuthed);
    const host = window.location.host;
    MyWebSocket.ws = new WebSocket("ws://" + host + "/ws/games/1/queue/2", [
        "Authorization",
        token,
    ]);

	MyWebSocket.ws.onopen = () => {
        setLoading(false);
    };

    MyWebSocket.ws.onmessage = (event) => {
        console.log("WEBSOCKET: ", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] == "system.grouping") {
                const playerList = jsonData["data"]["players"];
                setUserQueue(playerList);
            }
            if (jsonData["type"] == "system.message") {
                const playerList = jsonData["data"];
                if (playerList["message"] === "user.disconnected") {
                    setUserQueue((prevState) => {
                        const newState = { ...prevState };
                        for (let key in newState) {
                            if (newState[key] === playerList["user_id"]) {
                                delete newState[key];
                                break;
                            }
                        }
                        return newState;
                    });
                }
            }
            if (jsonData["type"] == "user.message") {
                const playerReadyList = jsonData["data"]["state"];
                setUserReadyList((prevState) => ({
                    ...prevState,
                    ...playerReadyList,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export function sendMessage(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        logError("WebSocket connection is not open");
    }
}
