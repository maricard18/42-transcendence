import { BallTopSpeedX, BallTopSpeedY } from "./variables";

export function checkPlayer1Collision(ball, player)
{
	if (ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.x + ball.radius >= player.x + player.width &&
    	ball.y + ball.radius >= player.y && 
		ball.y - ball.radius <= player.y + player.height) {
		if (ball.speed_x < -BallTopSpeedX) {
			ball.speed_x = BallTopSpeedX;
		} else {
			ball.speed_x *= -ball.acceleration;
		}
			
		const y_velocity = (ball.y - (player.y + player.height / 2)) / (player.height / 2) * ball.speed_x;
		if (y_velocity > BallTopSpeedY) {
			ball.speed_y = BallTopSpeedY;
		} else if (y_velocity < -BallTopSpeedY) {
			ball.speed_y = -BallTopSpeedY;
		} else {
			ball.speed_y = y_velocity;
		}
	}	
	else if (ball.speed_y > 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.y + ball.radius >= player.y &&
		ball.y - ball.radius <= player.y) {
		ball.speed_y *= -ball.acceleration;
	}
	else if (ball.speed_y < 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.y + ball.radius >= player.y + player.height) {
		ball.speed_y *= -ball.acceleration;
	}
}

export function checkPlayer2Collision(ball, player)
{
	if (ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.x - ball.radius <= player.x &&
    	ball.y + ball.radius >= player.y && 
		ball.y - ball.radius <= player.y + player.height) {
		if (ball.speed_x > BallTopSpeedX) {
			ball.speed_x = -BallTopSpeedX;
		} else {
			ball.speed_x *= -ball.acceleration;
		}

		const y_velocity = -(ball.y - (player.y + player.height / 2)) / (player.height / 2) * ball.speed_x;
		if (y_velocity > BallTopSpeedY) {
			ball.speed_y = BallTopSpeedY;
		} else if (y_velocity < -BallTopSpeedY) {
			ball.speed_y = -BallTopSpeedY;
		} else {
			ball.speed_y = y_velocity;
		}
	}
	else if (ball.speed_y > 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.y + ball.radius >= player.y &&
		ball.y - ball.radius <= player.y) {
		ball.speed_y *= -ball.acceleration;
	}
	else if (ball.speed_y < 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.y + ball.radius >= player.y + player.height) {
		ball.speed_y *= -ball.acceleration;
	}
}

export function checkInvertedPlayer1Collision(ball, player)
{
	if (ball.speed_y < 0 &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.y + ball.radius >= player.y + player.height &&
    	ball.x + ball.radius >= player.x && 
		ball.x - ball.radius <= player.x + player.width) {
		if (ball.speed_y < -BallTopSpeedY) {
			ball.speed_y = BallTopSpeedY;
		} else {
			ball.speed_y *= -ball.acceleration;
		}
			
		const x_velocity = (ball.x - (player.x + player.width / 2)) / (player.width / 2) * ball.speed_x;
		if (x_velocity > BallTopSpeedX) {
			ball.speed_x = BallTopSpeedX;
		} else if (x_velocity < -BallTopSpeedX) {
			ball.speed_x = -BallTopSpeedX;
		} else {
			ball.speed_x = x_velocity;
		}
	}	
	else if (ball.speed_x > 0 && ball.speed_y < 0 &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.x + ball.radius >= player.x &&
		ball.x - ball.radius <= player.x) {
		ball.speed_x *= -ball.acceleration;
	}
	else if (ball.speed_x < 0 && ball.speed_y < 0 &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.x + ball.radius >= player.x + player.width) {
		ball.speed_x *= -ball.acceleration;
	}
}

export function checkInvertedPlayer2Collision(ball, player)
{
	if (ball.speed_y > 0 &&
		ball.y + ball.radius >= player.y &&
		ball.y - ball.radius <= player.y &&
    	ball.x + ball.radius >= player.x && 
		ball.x - ball.radius <= player.x + player.width) {
		if (ball.speed_y > BallTopSpeedY) {
			ball.speed_y = -BallTopSpeedY;
		} else {
			ball.speed_y *= -ball.acceleration;
		}

		const x_velocity = -(ball.x - (player.x + player.width / 2)) / (player.width / 2) * ball.speed_y;
		if (x_velocity > BallTopSpeedX) {
			ball.speed_x = BallTopSpeedX;
		} else if (x_velocity < -BallTopSpeedX) {
			ball.speed_x = -BallTopSpeedX;
		} else {
			ball.speed_x = x_velocity;
		}
	}
	else if (ball.speed_x > 0 && ball.speed_y > 0 &&
		ball.y + ball.radius >= player.y &&
		ball.x + ball.radius >= player.x &&
		ball.x - ball.radius <= player.x) {
		ball.speed_x *= -ball.acceleration;
	}
	else if (ball.speed_x < 0 && ball.speed_y > 0 &&
		ball.y + ball.radius >= player.y &&
		ball.x - ball.radius <= player.x+ player.width &&
		ball.x + ball.radius >= player.x + player.width) {
		ball.speed_x *= -ball.acceleration;
	}
}
