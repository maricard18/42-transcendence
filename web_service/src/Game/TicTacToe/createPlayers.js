import AbstractView from "../../views/AbstractView";
import { Cpu, Opponent, Player } from "./Player";
import { Game } from "./Game";
import { findTournamentMatch } from "../../views/Tournament";

export function createSinglePlayerGameObjects(canvas, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player({symbol: "X", info: AbstractView.userInfo})
            : new Player({symbol: "X", info: AbstractView.userInfo});

    const player2 =
        lobbySize == 1
            ? new Cpu({symbol: "O", info: {id: -1, username: localStorage.getItem("player2")}})
            : new Player({symbol: "O", info: {id: -2, username: localStorage.getItem("player2")}});

    return new Game({
        canvas: canvas,
        player1: player1,
        player2: player2,
        mode: "single-player",
        host_id: null,
        lobbySize: lobbySize,
    });
}

export function createMultiPlayer2GameObjects(canvas, lobbySize) {
    const host_id = AbstractView.userData[0].id;
    let player1, player2;

    if (host_id == AbstractView.userInfo.id) {
        player1 = new Player({symbol: "X", info: AbstractView.userData[0]});
        player2 = new Opponent({symbol: "O", info: AbstractView.userData[1]});
    } else {
        player1 = new Opponent({symbol: "X", info: AbstractView.userData[0]});
        player2 = new Player({symbol: "O", info: AbstractView.userData[1]});
    }

    return new Game({
        canvas: canvas,
        player1: player1,
        player2: player2,
        mode: "multiplayer",
        host_id: host_id,
        lobbySize: lobbySize,
    });
}

export function createTournamentGameObjects(canvas) {
    const match = findTournamentMatch();
    const player1 = new Player({symbol: "X", info: match["player1"]});
    const player2 = new Player({symbol: "O", info: match["player2"]});

    return new Game({
        canvas: canvas,
        player1: player1,
        player2: player2,
        mode: "tournament",
        host_id: null,
        lobbySize: "2",
    });
}