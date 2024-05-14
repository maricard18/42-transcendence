import AbstractView from "../../views/AbstractView";
import { createSinglePlayerGameObjects, createMultiPlayer2GameObjects, createTournamentGameObjects } from "./createPlayers";
import { MyWebSocket, sendMessage } from "../../functions/websocket";
import { multiplayerTicTacToeMessageHandler } from "../../functions/websocket";
import { gameConfettiAnimation, gameStartAnimation } from "./animations";
import { updateVariables } from "./variables";
import { ScreenSize } from "./variables";
import { findTournamentWinner } from "../../views/Tournament";

export function createTicTacToeGameObject(canvas, gameMode, lobbySize) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);
    updateVariables(canvas);

    if (gameMode === "single-player") {
        return createSinglePlayerGameObjects(canvas, lobbySize);
    } else if ( gameMode === "multiplayer" && lobbySize == 2) {
        return createMultiPlayer2GameObjects(canvas, lobbySize);
    } else {
		return createTournamentGameObjects(canvas);
	}
}

export async function startTicTacToe(game) {
	localStorage.removeItem("game_winner");
	if (game.mode === "single-player") {
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await singleplayerGameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else if (game.mode === "multiplayer" && game.lobbySize == 2) {
		multiplayerTicTacToeMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer2GameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else {
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await singleplayerGameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	}
}

function singleplayerGameLoop(game) {
	game.player1.myTurn = true;
    
	return new Promise((resolve) => {
        const clickHandler = (event) => {
			game.clear();
			game.drawBoard();
			game.hit(event.offsetX, event.offsetY);
			game.checkWinner();
            
            if (game.over || !localStorage.getItem("game_status")) {
                game.canvas.removeEventListener("click", clickHandler);
				game.winner = game.winner === 1 ? game.player1.info.username : game.player2.info.username;
				game.last_time = Date.now();

				if (game.mode === "tournament") {
					findTournamentWinner(game, [game.player1, game.player2]);
				}

                resolve();
            }
        };
        
		game.canvas.addEventListener("click", clickHandler);
		game.clear();
		game.drawBoard();
    });
}

function multiplayer2GameLoop(game) {
	game.player1.myTurn = true;

	return new Promise((resolve) => {
        const clickHandler = (event) => {
			if (game.over || !MyWebSocket.ws || !localStorage.getItem("game_status")) {
				if (!game.winner) {
					game.winner = localStorage.getItem("game_winner");
				}
				game.over = true;
				resolve();
			} else {
				game.clear();
				game.drawBoard();
				game.hit(event.offsetX, event.offsetY);
				game.checkWinner();
				
				if ((game.over || !MyWebSocket.ws || !localStorage.getItem("game_status"))) {
					game.canvas.removeEventListener("click", clickHandler);
					game.winner = game.winner === 1 ? game.player1.info.username : game.player2.info.username;
					game.last_time = Date.now();
					sendMessage(game, 1);
					resolve();
				}
			}
        };
        
		game.canvas.addEventListener("click", clickHandler);
		game.clear();
		game.drawBoard();
    });
}

export function clearBackground(ctx) {
    ctx.clearRect(0, 0, ScreenSize, ScreenSize);
}

export function sendTicTacToeMessage(game, index) {
    const message = {
        game: {
            index: index,
            screen_size: ScreenSize,
            plays: game[`player${index}`].plays,
			board: game.board,
			player1_turn: game.player1.myTurn,
			player2_turn: game.player2.myTurn,
            over: game.over,
            winner: game.winner,
        }
    }

    sendMessage(MyWebSocket.ws, message);
}

export function updateScore(game) {
	const player1 = document.getElementById("player1");
	const player2 = document.getElementById("player2");
	const player3 = document.getElementById("player3");
	const player4 = document.getElementById("player4");

	if (player1) {
		player1.innerHTML = game.player1.score;
	}
	if (player2) {
		player2.innerHTML = game.player2.score;
	}
	if (player3) {
		player3.innerHTML = game.player3.score;
	}
	if (player4) {
		player4.innerHTML = game.player4.score;
	}
}
		