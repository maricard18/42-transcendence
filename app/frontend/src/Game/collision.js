export function checkPlayerCollision(ball, paddle)
{
	if (ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.x + ball.radius >= paddle.x + paddle.width &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height)	
		ball.speed_x *= -1.05; // right side
	else if (ball.speed_y > 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y)
		ball.speed_y *= -1.05; // top
	else if (ball.speed_y < 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.y + ball.radius >= paddle.y + paddle.height)
		ball.speed_y *= -1.05; // bottom
}

export function checkCpuCollision(ball, paddle)
{
	if (ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.x - ball.radius <= paddle.x &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height)
		ball.speed_x *= -1.05; // right side
	else if (ball.speed_y > 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y)
		ball.speed_y *= -1.05; // top
	else if (ball.speed_y < 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= paddle.x &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.y + ball.radius >= paddle.y + paddle.height)
		ball.speed_y *= -1.05; // bottom
}



