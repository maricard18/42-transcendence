import { BallSpeedX, BallSpeedY, BallTopSpeedX, BallTopSpeedY } from "./variables";

export function checkPlayer1Collision(game) {
    if (game.ball.speed_x < 0 &&
        game.ball.x - game.ball.radius <= game.player1.x + game.player1.width &&
        game.ball.x + game.ball.radius >= game.player1.x + game.player1.width &&
        game.ball.y + game.ball.radius >= game.player1.y &&
        game.ball.y - game.ball.radius <= game.player1.y + game.player1.height) {
        game.lastTouch = "player1";

        if (game.ball.speed_x < -BallTopSpeedX) {
            game.ball.speed_x = BallTopSpeedX;
        } else {
            game.ball.speed_x *= -game.ball.acceleration;
        }

        const y_velocity = (game.ball.y - (game.player1.y + game.player1.height / 2)) / (game.player1.height / 2) * game.ball.speed_x;
        if (y_velocity > 0 && y_velocity > BallTopSpeedY) {
            game.ball.speed_y = BallTopSpeedY;
        } else if (y_velocity < 0 && y_velocity < -BallTopSpeedY) {
            game.ball.speed_y = -BallTopSpeedY;
        } else if (y_velocity > 0 && y_velocity < BallSpeedY) {
            game.ball.speed_y = BallSpeedY;
        } else if (y_velocity < 0 && y_velocity > -BallSpeedY) {
            game.ball.speed_y = -BallSpeedY;
        } else {
            game.ball.speed_y = y_velocity;
        }
    } else if (game.ball.speed_y > 0 && game.ball.speed_x < 0 &&
        game.ball.x - game.ball.radius <= game.player1.x + game.player1.width &&
        game.ball.y + game.ball.radius >= game.player1.y &&
        game.ball.y - game.ball.radius <= game.player1.y) {
        game.ball.speed_y *= -game.ball.acceleration;
    } else if (game.ball.speed_y < 0 && game.ball.speed_x < 0 &&
        game.ball.x - game.ball.radius <= game.player1.x + game.player1.width &&
        game.ball.y - game.ball.radius <= game.player1.y + game.player1.height &&
        game.ball.y + game.ball.radius >= game.player1.y + game.player1.height) {
        game.ball.speed_y *= -game.ball.acceleration;
    }
}

export function checkPlayer2Collision(game) {
    if (game.ball.speed_x > 0 &&
        game.ball.x + game.ball.radius >= game.player2.x &&
        game.ball.x - game.ball.radius <= game.player2.x &&
        game.ball.y + game.ball.radius >= game.player2.y &&
        game.ball.y - game.ball.radius <= game.player2.y + game.player2.height) {
        game.lastTouch = "player2";

        if (game.ball.speed_x > BallTopSpeedX) {
            game.ball.speed_x = -BallTopSpeedX;
        } else {
            game.ball.speed_x *= -game.ball.acceleration;
        }

        const y_velocity = -(game.ball.y - (game.player2.y + game.player2.height / 2)) / (game.player2.height / 2) * game.ball.speed_x;
        if (y_velocity > 0 && y_velocity > BallTopSpeedY) {
            game.ball.speed_y = BallTopSpeedY;
        } else if (y_velocity < 0 && y_velocity < -BallTopSpeedY) {
            game.ball.speed_y = -BallTopSpeedY;
        } else if (y_velocity > 0 && y_velocity < BallSpeedY) {
            game.ball.speed_y = BallSpeedY;
        } else if (y_velocity < 0 && y_velocity > -BallSpeedY) {
            game.ball.speed_y = -BallSpeedY;
        } else {
            game.ball.speed_y = y_velocity;
        }
    } else if (game.ball.speed_y > 0 && game.ball.speed_x > 0 &&
        game.ball.x + game.ball.radius >= game.player2.x &&
        game.ball.y + game.ball.radius >= game.player2.y &&
        game.ball.y - game.ball.radius <= game.player2.y) {
        game.ball.speed_y *= -game.ball.acceleration;
    } else if (game.ball.speed_y < 0 && game.ball.speed_x > 0 &&
        game.ball.x + game.ball.radius >= game.player2.x &&
        game.ball.y - game.ball.radius <= game.player2.y + game.player2.height &&
        game.ball.y + game.ball.radius >= game.player2.y + game.player2.height) {
        game.ball.speed_y *= -game.ball.acceleration;
    }
}

export function checkInvertedPlayer3Collision(game) {
    if (game.ball.speed_y < 0 &&
        game.ball.y - game.ball.radius <= game.player3.y + game.player3.height &&
        game.ball.y + game.ball.radius >= game.player3.y + game.player3.height &&
        game.ball.x + game.ball.radius >= game.player3.x &&
        game.ball.x - game.ball.radius <= game.player3.x + game.player3.width) {
        game.lastTouch = "player3";

        if (game.ball.speed_y < -BallTopSpeedY) {
            game.ball.speed_y = BallTopSpeedY;
        } else {
            game.ball.speed_y *= -game.ball.acceleration;
        }

        const x_velocity = (game.ball.x - (game.player3.x + game.player3.width / 2)) / (game.player3.width / 2) * game.ball.speed_y;
        if (x_velocity > 0 && x_velocity > BallTopSpeedX) {
            game.ball.speed_x = BallTopSpeedX;
        } else if (x_velocity < 0 && x_velocity < -BallTopSpeedX) {
            game.ball.speed_x = -BallTopSpeedX;
        } else if (x_velocity > 0 && x_velocity < BallSpeedX) {
            game.ball.speed_x = BallSpeedX;
        } else if (x_velocity < 0 && x_velocity > -BallSpeedX) {
            game.ball.speed_x = -BallSpeedX;
        } else {
            game.ball.speed_x = x_velocity;
        }
    } else if (game.ball.speed_x > 0 && game.ball.speed_y < 0 &&
        game.ball.y - game.ball.radius <= game.player3.y + game.player3.height &&
        game.ball.x + game.ball.radius >= game.player3.x &&
        game.ball.x - game.ball.radius <= game.player3.x) {
        game.ball.speed_x *= -game.ball.acceleration;
    } else if (game.ball.speed_x < 0 && game.ball.speed_y < 0 &&
        game.ball.y - game.ball.radius <= game.player3.y + game.player3.height &&
        game.ball.x - game.ball.radius <= game.player3.x + game.player3.width &&
        game.ball.x + game.ball.radius >= game.player3.x + game.player3.width) {
        game.ball.speed_x *= -game.ball.acceleration;
    }
}

export function checkInvertedPlayer4Collision(game) {
    if (game.ball.speed_y > 0 &&
        game.ball.y + game.ball.radius >= game.player4.y &&
        game.ball.y - game.ball.radius <= game.player4.y &&
        game.ball.x + game.ball.radius >= game.player4.x &&
        game.ball.x - game.ball.radius <= game.player4.x + game.player4.width) {
        game.lastTouch = "player4";

        if (game.ball.speed_y > BallTopSpeedY) {
            game.ball.speed_y = -BallTopSpeedY;
        } else {
            game.ball.speed_y *= -game.ball.acceleration;
        }

        const x_velocity = -(game.ball.x - (game.player4.x + game.player4.width / 2)) / (game.player4.width / 2) * game.ball.speed_y;
        if (x_velocity > 0 && x_velocity > BallTopSpeedX) {
            game.ball.speed_x = BallTopSpeedX;
        } else if (x_velocity < 0 && x_velocity < -BallTopSpeedX) {
            game.ball.speed_x = -BallTopSpeedX;
        } else if (x_velocity > 0 && x_velocity < BallSpeedX) {
            game.ball.speed_x = BallSpeedX;
        } else if (x_velocity < 0 && x_velocity > -BallSpeedX) {
            game.ball.speed_x = -BallSpeedX;
        } else {
            game.ball.speed_x = x_velocity;
        }
    } else if (game.ball.speed_x > 0 && game.ball.speed_y > 0 &&
        game.ball.y + game.ball.radius >= game.player4.y &&
        game.ball.x + game.ball.radius >= game.player4.x &&
        game.ball.x - game.ball.radius <= game.player4.x) {
        game.ball.speed_x *= -game.ball.acceleration;
    } else if (game.ball.speed_x < 0 && game.ball.speed_y > 0 &&
        game.ball.y + game.ball.radius >= game.player4.y &&
        game.ball.x - game.ball.radius <= game.player4.x + game.player4.width &&
        game.ball.x + game.ball.radius >= game.player4.x + game.player4.width) {
        game.ball.speed_x *= -game.ball.acceleration;
    }
}
