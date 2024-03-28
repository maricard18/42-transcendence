import { getToken } from "./tokens";

export var ws;

export async function connectWebsocket(setAuthed, setUserQueue) {
    const token = await getToken(setAuthed);
    ws = new WebSocket("ws://localhost:8000/ws/games/1/queue/2", [
        "Authorization",
        token,
    ]);

    //ws.onopen = (event) => {
    //    console.log("Connected to server: ", event.data);
    //};

    ws.onmessage = (event) => {
        console.log("Message from server: ", event.data);
		
		try {
			const jsonData = JSON.parse(event.data);
	
			if (jsonData["type"] == "system.grouping") {
				const playerList = jsonData["data"]["players"];
				setUserQueue(playerList);
			}
		} catch (error) {
			console.log(error);
		}
    };
}

export function sendMessage(message) {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    const msg = {
        type: "message",
        text: document.getElementById("text").value,
        id: clientID,
        date: Date.now(),
    };

    // Send the msg object as a JSON-formatted string.
    exampleSocket.send(JSON.stringify(msg));

    // Blank the text input element, ready to receive the next line of text from the user.
    document.getElementById("text").value = "";
}
