export function checkPlayerCoallision(ball, paddle)
{
	if (ball.x - ball.radius <= paddle.x + paddle.width &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height)
		ball.speed_x *= -1.05;
}

export function checkCpuCoallision(ball, paddle)
{
	if (ball.x + ball.radius >= paddle.x &&
    	ball.y + ball.radius >= paddle.y && 
		ball.y - ball.radius <= paddle.y + paddle.height)
		ball.speed_x *= -1.05;
}

