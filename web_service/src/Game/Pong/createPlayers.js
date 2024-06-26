import AbstractView from "../../views/AbstractView";
import { Cpu, InvertedOpponent, InvertedPlayer, Opponent, Player } from "./Player";
import { Ball } from "./Ball";
import { Game } from "./Game";
import { PaddleHeight, PaddleStartX, PaddleWidth, ScreenHeight, ScreenWidth } from "./variables";
import { findTournamentMatch } from "../../views/Tournament";

export function createSinglePlayerGameObjects(ctx, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player({
                x: PaddleStartX,
                y: ScreenHeight / 2 - PaddleHeight / 2,
                color: "red",
                keyUp: "ArrowUp",
                keyDown: "ArrowDown",
                info: AbstractView.userInfo,
            })
            : new Player({
                x: PaddleStartX,
                y: ScreenHeight / 2 - PaddleHeight / 2,
                color: "red",
                keyUp: "w",
                keyDown: "s",
                info: {id: -2, username: localStorage.getItem("player1")}
            });

    const player2 =
        lobbySize == 1
            ? new Cpu({
                x: ScreenWidth - PaddleStartX - PaddleWidth,
                y: ScreenHeight / 2 - PaddleHeight / 2,
                color: "blue",
                info: {id: -1, username: localStorage.getItem("player2")}
            })
            : new Player({
                x: ScreenWidth - PaddleStartX - PaddleWidth,
                y: ScreenHeight / 2 - PaddleHeight / 2,
                color: "blue",
                keyUp: "ArrowUp",
                keyDown: "ArrowDown",
                info: AbstractView.userInfo,
            });

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
			lobbySize: lobbySize
		}),
        player1: player1,
        player2: player2,
        mode: "single-player",
        host_id: null,
        lobbySize: lobbySize,
    });
}

export function createMultiPlayer2GameObjects(ctx, lobbySize) {
    const host_id = AbstractView.userData[0].id;
    let player1, player2;

    if (host_id == AbstractView.userInfo.id) {
        player1 = new Player({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
    } else {
        player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Player({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
    }

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
			lobbySize: lobbySize
		}),
        player1: player1,
        player2: player2,
        mode: "multiplayer",
        host_id: host_id,
        lobbySize: lobbySize,
    });
}

export function createMultiPlayer4GameObjects(ctx, lobbySize) {
    const host_id = AbstractView.userData[0].id;
    let player1, player2, player3, player4;

    if (host_id == AbstractView.userInfo.id) {
        player1 = new Player({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
        player3 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: PaddleStartX,
            color: "green",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[2],
        });
        player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: ScreenHeight - PaddleStartX - PaddleWidth,
            color: "yellow",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[3],
        });
    } else if (AbstractView.userInfo.id == AbstractView.userData[1].id) {
        player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Player({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
        player3 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: PaddleStartX,
            color: "green",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[2],
        });
        player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: ScreenHeight - PaddleStartX - PaddleWidth,
            color: "yellow",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[3],
        });
    } else if (AbstractView.userInfo.id == AbstractView.userData[2].id) {
        player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
        player3 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: PaddleStartX,
            color: "green",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[2],
        });
        player4 = new InvertedPlayer({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: ScreenHeight - PaddleStartX - PaddleWidth,
            color: "yellow",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[3],
        });
    } else if (AbstractView.userInfo.id == AbstractView.userData[3].id) {
        player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[0],
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: AbstractView.userData[1],
        });
        player3 = new InvertedPlayer({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: PaddleStartX,
            color: "green",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[2],
        });
        player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleHeight / 2,
            y: ScreenHeight - PaddleStartX - PaddleWidth,
            color: "yellow",
            keyRight: "ArrowRight",
            keyLeft: "ArrowLeft",
            info: AbstractView.userData[3],
        });
    }

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
			lobbySize: lobbySize
		}),
        player1: player1,
        player2: player2,
        player3: player3,
        player4: player4,
        mode: "multiplayer",
        host_id: host_id,
        lobbySize: lobbySize,
    });
}

export function createTournamentGameObjects(ctx, lobbySize) {
	const match = findTournamentMatch();

    const player1 = new Player({
		x: PaddleStartX,
		y: ScreenHeight / 2 - PaddleHeight / 2,
		color: "red",
		keyUp: "w",
		keyDown: "s",
		info: match["player1"]
	});

    const player2 = new Player({
		x: ScreenWidth - PaddleStartX - PaddleWidth,
		y: ScreenHeight / 2 - PaddleHeight / 2,
		color: "blue",
		keyUp: "ArrowUp",
		keyDown: "ArrowDown",
		info: match["player2"]
	});

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
			lobbySize: lobbySize
		}),
        player1: player1,
        player2: player2,
        mode: "tournament",
        host_id: null,
        lobbySize: "2",
    });
}