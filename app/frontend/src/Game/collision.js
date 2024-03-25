export function checkPlayerCollision(ball, paddle)
{
	if (ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.x + ball.radius >= paddle.x + paddle.width &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height) {
			ball.speed_x *= -1.05;
			
			let distance = Math.abs(ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
			ball.speed_y += distance;
		}	
	else if (ball.speed_y > 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y)
		ball.speed_y *= -1.05;
	else if (ball.speed_y < 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.y + ball.radius >= paddle.y + paddle.height)
		ball.speed_y *= -1.05;
}

export function checkCpuCollision(ball, paddle)
{
	if (ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.x - ball.radius <= paddle.x &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height) {
			ball.speed_x *= -1.05;

			let distance = Math.abs(ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        	ball.speed_y += distance;
		}
	else if (ball.speed_y > 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y)
		ball.speed_y *= -1.05;
	else if (ball.speed_y < 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.y + ball.radius >= paddle.y + paddle.height)
		ball.speed_y *= -1.05;
}



