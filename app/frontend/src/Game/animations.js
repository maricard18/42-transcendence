import { ScreenHeight, ScreenWidth } from "./Pong/variables";

export function gameStartAnimation(game) {
    return new Promise((resolve) => {
        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            game.clear();
            game.player1.draw(game.ctx);
            game.player2.draw(game.ctx);

			if (game.player3) {
				game.player3.draw(game.ctx);
			}
			if (game.player4) {
				game.player4.draw(game.ctx);
			}

            game.ctx.font = `${0.3 * ScreenWidth}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                5 - elapsedTime,
                ScreenWidth / 2,
                2 * ScreenHeight / 5
            );

			game.ctx.font = `bold ${0.03 * ScreenWidth}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                "FIRST TO 5 GOALS WINS",
                ScreenWidth / 2,
                6 * ScreenHeight / 9
            );

			if (game.lobbySize == 1 || 
				(game.mode === "multiplayer" && game.lobbySize == 2)) {
				game.ctx.font = `bold ${0.025 * ScreenWidth}px Arial`;
				game.ctx.fillStyle = "white";
				game.ctx.textAlign = "center";
				game.ctx.textBaseline = "middle";
				game.ctx.fillText(
					"use the arrow keys to move the player",
					ScreenWidth / 2,
					7 * ScreenHeight / 9
				);
			} else if (game.lobbySize == 2) {
				game.ctx.font = `bold ${0.025 * ScreenWidth}px Arial`;
				game.ctx.fillStyle = "white";
				game.ctx.textAlign = "center";
				game.ctx.textBaseline = "middle";
				game.ctx.fillText(
					"use the w and s keys",
					2 * ScreenWidth / 6,
					7 * ScreenHeight / 9
				);
				game.ctx.fillText(
					"to move the player",
					2 * ScreenWidth / 6,
					7 * ScreenHeight / 9 + 0.025 * ScreenWidth
				);
				
				game.ctx.fillText(
					"use the arrow keys",
					4 * ScreenWidth / 6,
					7 * ScreenHeight / 9
				);
				game.ctx.fillText(
					"to move the player",
					4 * ScreenWidth / 6,
					7 * ScreenHeight / 9 + 0.025 * ScreenWidth
				);
			}

            if (elapsedTime < 5 && !game.over) {
                window.requestAnimationFrame(animate);
            } else {
                game.paused = false;
                resolve();
            }
        };

        window.requestAnimationFrame(animate);
    });
}

export function gameConfettiAnimation(game) {
    return new Promise((resolve) => {
        let confettiParticles = [];

        const addConfetti = () => {
            for (let i = 0; i < 20; i++) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const angle = (Math.random() * Math.PI) / 3 - Math.PI / 3;
                const speed = Math.random() * 3 + 1;
                confettiParticles.push({
                    x: side > 0 ? 0 : game.ctx.canvas.width,
                    y: game.ctx.canvas.height / 3,
                    size: Math.random() * 5 + 1,
                    speedX: side * Math.cos(angle) * speed,
                    speedY: Math.sin(angle) * speed,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                });
            }
        };

        const drawWinnerName = (ctx) => {
            ctx.fillStyle = "white";
            ctx.font = "bold 30px Arial";
            ctx.textAlign = "center";
            ctx.fillText(game.winner + " wins", ctx.canvas.width / 2, ctx.canvas.height / 2);
        };

        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            game.clear();
            game.player1.draw(game.ctx);
            game.player2.draw(game.ctx);

			if (game.player3) {
				game.player3.draw(game.ctx);
			}
			if (game.player4) {
				game.player4.draw(game.ctx);
			}

            confettiParticles.forEach((particle) => {
                game.ctx.fillStyle = particle.color;
                game.ctx.fillRect(
                    particle.x,
                    particle.y,
                    particle.size,
                    particle.size
                );

                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += 0.05;
            });

            if (elapsedTime < 5) {
                window.requestAnimationFrame(animate);
				if (elapsedTime > 0.5) {
					drawWinnerName(game.ctx);
				}
                if (elapsedTime < 1) {
                    addConfetti();
                }
            } else {
                resolve();
            }
        };

        addConfetti();
        window.requestAnimationFrame(animate);
    });
}

