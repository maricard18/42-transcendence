export function checkPlayerCollision(ball, player)
{
	if (ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.x + ball.radius >= player.x + player.width &&
    	ball.y + ball.radius >= player.y && 
		ball.y - ball.radius <= player.y + player.height) {
			ball.speed_x *= -ball.acceleration;
			
			let distance = Math.abs(ball.y - (player.y + player.height / 2)) / (player.height / 2);
			ball.speed_y += distance;
		}	
	else if (ball.speed_y > 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.y + ball.radius >= player.y &&
		ball.y - ball.radius <= player.y)
		ball.speed_y *= -ball.acceleration;
	else if (ball.speed_y < 0 && ball.speed_x < 0 &&
		ball.x - ball.radius <= player.x + player.width &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.y + ball.radius >= player.y + player.height)
		ball.speed_y *= -ball.acceleration;
}

export function checkCpuCollision(ball, player)
{
	if (ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.x - ball.radius <= player.x &&
    	ball.y + ball.radius >= player.y && 
		ball.y - ball.radius <= player.y + player.height) {
			ball.speed_x *= -ball.acceleration;

			let distance = Math.abs(ball.y - (player.y + player.height / 2)) / (player.height / 2);
        	ball.speed_y += distance;
			console.log(distance);
		}
	else if (ball.speed_y > 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.y + ball.radius >= player.y &&
		ball.y - ball.radius <= player.y)
		ball.speed_y *= -ball.acceleration;
	else if (ball.speed_y < 0 && ball.speed_x > 0 &&
		ball.x + ball.radius >= player.x &&
		ball.y - ball.radius <= player.y + player.height &&
		ball.y + ball.radius >= player.y + player.height)
		ball.speed_y *= -ball.acceleration;
}



