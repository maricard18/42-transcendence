import { ScreenWidth } from "../Game/variables";
import { clearBackground, drawGoal, drawScore } from "../Game/pongGameCode";
import { getToken } from "./tokens";

export var MyWebSocket = {};

export async function connectWebsocket(
    setAuthed,
    setUserQueue,
    setUserReadyList,
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

export function multiplayerMessageHandler(MyWebSocket, game, setGameOver) {
    if (MyWebSocket.ws) {
        MyWebSocket.ws.onmessage = (event) => {
            //console.log("GAME", JSON.parse(event.data));

            try {
                const jsonData = JSON.parse(event.data);

                if (jsonData["type"] === "user.message") {
                    const gameData = jsonData["data"]["game"];
                    game.player2.x = gameData["player_x"];
                    game.player2.y = gameData["player_y"];

                    if (gameData["id"] == game.host_id) {
                        if (gameData["paused"]) {
                            updateOpponentScreen(game, gameData);
                        } else {
                            game.paused = false;
                            game.ball.x = gameData["ball_x"];
                            game.ball.y = gameData["ball_y"];
                            game.ball.speed_x = gameData["ball_speed_x"];
                            game.ball.speed_y = gameData["ball_speed_y"];
                            game.player1.score = gameData["opponent_score"];
                            game.player2.score = gameData["player_score"];
                        }
                    }
                }
                if (jsonData["type"] == "system.message") {
                    const playerList = jsonData["data"];
                    if (playerList["message"] === "user.disconnected") {
                        console.log("User disconnected from the Game!");
                        console.log("You won!");
                        MyWebSocket.ws.close();
                        delete MyWebSocket.ws;
                        setGameOver(true);
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

function updateOpponentScreen(game, gameData) {
    game.paused = true;
    game.ball.x = gameData["ball_x"];
    game.ball.y = gameData["ball_y"];
    game.ball.speed_x = gameData["ball_speed_x"];
    game.ball.speed_y = gameData["ball_speed_y"];
    game.player1.score = gameData["opponent_score"];
    game.player2.score = gameData["player_score"];
    game.player1.x = game.player1.initial_x;
    game.player1.y = game.player1.initial_y;

    clearBackground(game.ctx);
    drawGoal(game.ctx, 0, 20, "white");
    drawGoal(game.ctx, ScreenWidth - 20, ScreenWidth, "white");
    drawScore(game.ctx, game.player2, ScreenWidth / 2 - 100);
    drawScore(game.ctx, game.player1, ScreenWidth / 2 + 100);
    game.ball.draw(game.ctx);
    game.player1.draw(game.ctx);
    game.player2.draw(game.ctx);
}
