import { GoalWidth, ScreenHeight, ScreenWidth } from "../Game/variables";
import { clearBackground } from "../Game/pongGame";
import { getToken } from "./tokens";

export var MyWebSocket = {};

export async function connectWebsocket(
    setAuthed,
    setUserQueue,
    setUserReadyList,
    setUserData,
    setWsCreated
) {
    const token = await getToken(setAuthed);
    const host = window.location.host;
    MyWebSocket.ws = new WebSocket("ws://" + host + "/ws/games/1/queue/2", [
        "Authorization",
        token,
    ]);

    MyWebSocket.ws.onopen = () => {
        setWsCreated(true);
    };

    MyWebSocket.ws.onmessage = (event) => {
        //console.log("SYSTEM", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] === "system.grouping") {
                const playerList = jsonData["data"]["players"];
                setUserQueue(playerList);
            }
            if (jsonData["type"] === "user.message") {
                const playerReadyList = jsonData["data"]["state"];
                setUserReadyList((prevState) => ({
                    ...prevState,
                    ...playerReadyList,
                }));
            }
            if (jsonData["type"] === "system.message") {
                const playerList = jsonData["data"];
                if (playerList["message"] === "user.disconnected") {
                    setUserData([]);
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
        } catch (error) {
            console.log(error);
        }
    };
}

export function multiplayerMessageHandler(MyWebSocket, game, setUserQueue, setUserData) {
    if (MyWebSocket.ws) {
        MyWebSocket.ws.onmessage = (event) => {
            //console.log("GAME", JSON.parse(event.data));

            try {
                const jsonData = JSON.parse(event.data);

                if (jsonData["type"] === "user.message") {
                    const gameData = jsonData["data"]["game"];
                    game.player2.x = (gameData["player1_x"] / gameData["screen_width"]) * ScreenWidth;
                    game.player2.y = (gameData["player1_y"] / gameData["screen_height"]) * ScreenHeight;

                    if (gameData["id"] == game.host_id) {
                        game.ball.x = (gameData["ball_x"] / gameData["screen_width"]) * ScreenWidth;
                        game.ball.y = (gameData["ball_y"] / gameData["screen_height"]) * ScreenHeight;
                        game.ball.speed_x = (gameData["ball_speed_x"] / gameData["screen_width"]) * ScreenWidth;
                        game.ball.speed_y = (gameData["ball_speed_y"] / gameData["screen_height"]) * ScreenHeight;
                        game.player1.score = gameData["player2_score"];
                        game.player2.score = gameData["player1_score"];
						game.player3.score = gameData["player3_score"];
						game.player4.score = gameData["player4_score"];
						game.paused = gameData["paused"];
                        game.over = gameData["over"];
						game.winner = gameData["winner"];

                        if (game.paused === true) {
                            updateOpponentScreen(game);
                        }
                    }
                }
                if (jsonData["type"] == "system.message") {
                    const playerList = jsonData["data"];
                    if (playerList["message"] === "user.disconnected") {
                        game.over = true;
                        closeWebsocket();
                        setUserData([]);
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
            } catch (error) {
                console.log(error);
            }
        };
    }
}

function updateOpponentScreen(game) {
	clearBackground(game.ctx);
	game.drawGoal(0, GoalWidth, "white");
	game.drawGoal(ScreenWidth - GoalWidth, ScreenWidth, "white");
	game.drawScore(game.player2, ScreenWidth / 2 - 0.08 * ScreenWidth);
	game.drawScore(game.player1, ScreenWidth / 2 + 0.08 * ScreenWidth);
	
	if (game.player1.score !== 5 && game.player2.score !== 5) {
		game.player1.x = game.player1.initial_x;
		game.player1.y = game.player1.initial_y;
		game.ball.draw(game.ctx);
	}
	
	game.player1.draw(game.ctx);
	game.player2.draw(game.ctx);
}

export function sendMessage(ws, message) {
    if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
}

export function closeWebsocket() {
    if (MyWebSocket.ws) {
        MyWebSocket.ws.close();
        delete MyWebSocket.ws;
    }
}
