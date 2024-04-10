import { ScreenHeight, ScreenWidth } from "../Game/variables";
import { clearBackground, drawGoal, drawScore } from "../Game/pongGameCode";
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
        console.log("Websocket Created");
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

export function multiplayerMessageHandler(
    MyWebSocket,
    game,
    setGameOver,
    setUserQueue,
    setUserData
) {
    if (MyWebSocket.ws) {
        MyWebSocket.ws.onmessage = (event) => {
            //console.log("GAME", JSON.parse(event.data));

            try {
                const jsonData = JSON.parse(event.data);

                if (jsonData["type"] === "user.message") {
                    const gameData = jsonData["data"]["game"];
                    game.player2.x =
                        (gameData["player1_x"] / gameData["screen_width"]) *
                        ScreenWidth;
                    game.player2.y =
                        (gameData["player1_y"] / gameData["screen_height"]) *
                        ScreenHeight;

                    if (gameData["id"] == game.host_id) {
                        game.paused = gameData["paused"];
                        game.over = gameData["over"];
                        game.ball.x =
                            (gameData["ball_x"] / gameData["screen_width"]) *
                            ScreenWidth;
                        game.ball.y =
                            (gameData["ball_y"] / gameData["screen_height"]) *
                            ScreenHeight;
                        game.ball.speed_x =
                            (gameData["ball_speed_x"] /
                                gameData["screen_width"]) *
                            ScreenWidth;
                        game.ball.speed_y =
                            (gameData["ball_speed_y"] /
                                gameData["screen_height"]) *
                            ScreenHeight;
                        game.player1.score = gameData["player2_score"];
                        game.player2.score = gameData["player1_score"];

                        if (gameData["paused"]) {
                            game.player1.x = game.player1.initial_x;
                            game.player1.y = game.player1.initial_y;
                            updateOpponentScreen(game, gameData);
                        }
                    }
                }
                if (jsonData["type"] == "system.message") {
                    const playerList = jsonData["data"];
                    if (playerList["message"] === "user.disconnected") {
                        game.over = true;
                        closeWebsocket()
                        setGameOver(true);
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

export function sendMessage(ws, message) {
    if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error("WebSocket connection is not open");
        }
    }
}

export function closeWebsocket() {
	if (MyWebSocket.ws) {
		MyWebSocket.ws.close();
		delete MyWebSocket.ws;
	}
}

function updateOpponentScreen(game, gameData) {
    clearBackground(game.ctx);
    drawGoal(game.ctx, 0, 0.04 * ScreenWidth, "white");
    drawGoal(game.ctx, ScreenWidth - 0.04 * ScreenWidth, ScreenWidth, "white");
    drawScore(game.ctx, game.player2, ScreenWidth / 2 - 0.08 * ScreenWidth);
    drawScore(game.ctx, game.player1, ScreenWidth / 2 + 0.08 * ScreenWidth);
    game.ball.draw(game.ctx);
    game.player1.draw(game.ctx);
    game.player2.draw(game.ctx);
}
