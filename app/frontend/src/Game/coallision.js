export default function checkCoallision(ball, paddle)
{
	if (ball.x + ball.radius >= paddle.x - paddle.width / 2 &&
    	ball.x - ball.radius <= paddle.x + paddle.width / 2 &&
    	ball.y + ball.radius >= paddle.y - paddle.height / 2 &&
    	ball.y - ball.radius <= paddle.y + paddle.height / 2)
			ball.speed_x *= -1.05;
}