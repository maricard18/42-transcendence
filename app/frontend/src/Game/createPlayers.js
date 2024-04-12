import { Player, Cpu, Opponent, InvertedPlayer, InvertedCpu, InvertedOpponent } from "./Player";
import { Ball } from "./Ball";
import { Game } from "./Game";
import { PaddleStartX, PaddleWidth, PaddleHeight, ScreenWidth, ScreenHeight } from "./variables";

export function createSinglePlayerGameObjects(ctx, userInfo, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player({
                  x: PaddleStartX,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  info: userInfo,
              })
            : new Player({
                  x: PaddleStartX,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "w",
                  keyDown: "s",
                  info: 0,
              });

    const player2 =
        lobbySize == 1
            ? new Cpu({
                  x: ScreenWidth - PaddleStartX - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
              })
            : new Player({
                  x: ScreenWidth - PaddleStartX - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  info: 0,
              });

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
        }),
        player1: player1,
        player2: player2,
        mode: "single-player",
        host_id: null,
        lobbySize: lobbySize,
    });
}

export function createMultiPlayer2GameObjects(ctx, userData, userInfo, lobbySize) {
	const host_id = userData[0].id;
    let player1, player2;

    if (host_id === userInfo.id) {
        player1 = new Player({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[0],
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[1],
        });
    } else {
		player1 = new Opponent({
			x: PaddleStartX,
			y: ScreenHeight / 2 - PaddleHeight / 2,
			color: "red",
			keyUp: "ArrowUp",
			keyDown: "ArrowDown",
			info: userData[0],
		});
        player2 = new Player({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[1],
        });
    }

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
        }),
        player1: player1,
        player2: player2,
        mode: "multiplayer",
        host_id: host_id,
        lobbySize: lobbySize,
    });
}

export function createMultiPlayer4GameObjects(ctx, userData, userInfo, lobbySize) {
    const host_id = userData[0].id;
    let player1, player2, player3, player4;

    if (host_id === userInfo.id) {
        player1 = new Player({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[0],
        });
		player2 = new Opponent({
			x: ScreenWidth - PaddleStartX - PaddleWidth,
			y: ScreenHeight / 2 - PaddleHeight / 2,
			color: "blue",
			keyUp: "ArrowUp",
			keyDown: "ArrowDown",
			info: userData[1],
		});
		player3 = new InvertedOpponent({
			x: ScreenWidth / 2 - PaddleWidth / 2,
            y: ScreenHeight - PaddleStartX - PaddleHeight,
            color: "yellow",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[2],
        });
		player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleWidth / 2,
            y: PaddleStartX,
            color: "green",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[3],
        });
    } else if (userInfo.id === userData[1].id) {
		player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[0],
        });
		player2 = new Player({
			x: ScreenWidth - PaddleStartX - PaddleWidth,
			y: ScreenHeight / 2 - PaddleHeight / 2,
			color: "blue",
			keyUp: "ArrowUp",
			keyDown: "ArrowDown",
			info: userData[1],
		});
		player3 = new InvertedOpponent({
			x: ScreenWidth / 2 - PaddleWidth / 2,
            y: ScreenHeight - PaddleStartX - PaddleHeight,
            color: "yellow",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[2],
        });
		player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleWidth / 2,
            y: PaddleStartX,
            color: "green",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[3],
        });
    } else if (userInfo.id === userData[2].id) {
		player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[0],
        });
		player2 = new Opponent({
			x: ScreenWidth - PaddleStartX - PaddleWidth,
			y: ScreenHeight / 2 - PaddleHeight / 2,
			color: "blue",
			keyUp: "ArrowUp",
			keyDown: "ArrowDown",
			info: userData[1],
		});
		player3 = new InvertedPlayer({
			x: ScreenWidth / 2 - PaddleWidth / 2,
            y: ScreenHeight - PaddleStartX - PaddleHeight,
            color: "yellow",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[2],
        });
		player4 = new InvertedOpponent({
            x: ScreenWidth / 2 - PaddleWidth / 2,
            y: PaddleStartX,
            color: "green",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[3],
        });
    } else if (userInfo.id === userData[3].id) {
		player1 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userData[0],
        });
		player2 = new Opponent({
			x: ScreenWidth - PaddleStartX - PaddleWidth,
			y: ScreenHeight / 2 - PaddleHeight / 2,
			color: "blue",
			keyUp: "ArrowUp",
			keyDown: "ArrowDown",
			info: userData[1],
		});
		player3 = new InvertedOpponent({
			x: ScreenWidth / 2 - PaddleWidth / 2,
            y: ScreenHeight - PaddleStartX - PaddleHeight,
            color: "yellow",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[2],
        });
		player4 = new InvertedPlayer({
            x: ScreenWidth / 2 - PaddleWidth / 2,
            y: PaddleStartX,
            color: "green",
            keyRigth: "ArrowRigth",
            keyLeft: "ArrowLeft",
            info: userData[3],
        });
    }

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
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