import { startGameAnimation } from "./animations";
import { Ball } from "./Ball";
import { Player } from "./Player1";
import { Cpu, Opponent } from "./Player2";
import { Game } from "./Game";
import { checkPlayer1Collision, checkPlayer2Collision } from "./collision";
import {
    startGame,
    clearBackground,
    drawGoal,
    drawScore,
    sendHostMessage,
    sendNonHostMessage,
} from "./pongGameCode";
import {
    paddleHeightScalar,
    paddlewidthScalar,
    ballRadiusScalar,
    ballSpeedXScalar,
    ballSpeedYScalar,
    ballTopSpeedXScalar,
    ballTopSpeedYScalar,
    ScreenWidth,
    ScreenHeight,
    PaddleSpeed,
    PaddleHeight,
    PaddleWidth,
    ballRadius,
    BallSpeedX,
    BallSpeedY,
    BallTopSpeedX,
    BallTopSpeedY,
    keys,
    updateVariables,
    pauseGame,
} from "./variables";
