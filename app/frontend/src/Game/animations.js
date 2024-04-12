import { clearBackground } from "./pongGame";
import { GoalWidth, ScreenHeight, ScreenWidth } from "./variables";
import { MyWebSocket } from "../functions/websocket";

export function gameStartAnimation(game) {
    return new Promise((resolve) => {
        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            clearBackground(game.ctx);
            game.drawGoal(0, GoalWidth, "white");
            game.drawGoal(ScreenWidth - GoalWidth, ScreenWidth, "white");

            game.ctx.font = `${0.3 * ScreenWidth}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                3 - elapsedTime,
                ScreenWidth / 2,
                ScreenHeight / 2
            );

            if (elapsedTime < 3 && !game.over) {
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

            clearBackground(game.ctx);
            game.player1.draw(game.ctx);
            game.player2.draw(game.ctx);
            game.drawScore(game.player1, ScreenWidth / 2 - 100);
            game.drawScore(game.player2, ScreenWidth / 2 + 100);

            confettiParticles.forEach((particle) => {
                game.ctx.fillStyle = particle.color;
                game.ctx.fillRect(
                    particle.x,
                    particle.y,
                    particle.size,
                    particle.size
                );
                game.drawGoal(0, GoalWidth, "white");
                game.drawGoal(
                    ScreenWidth - GoalWidth,
                    ScreenWidth,
                    "white"
                );

                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += 0.05;
            });

            if (
                elapsedTime < 5 &&
                (game.mode === "single-player" ||
                    (game.mode === "multiplayer" && MyWebSocket.ws))
            ) {
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

