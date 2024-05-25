import { ScreenSize } from "./variables";

export function gameStartAnimation(game) {
    return new Promise((resolve) => {
        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            game.clear();

            game.ctx.font = `${0.3 * ScreenSize}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                5 - elapsedTime,
                ScreenSize / 2,
                2 * ScreenSize / 5
            );

            game.ctx.font = `bold ${0.03 * ScreenSize}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                "FIRST TO GET 3 IN A ROW WINS",
                ScreenSize / 2,
                6 * ScreenSize / 9
            );

            game.ctx.font = `bold ${0.025 * ScreenSize}px Arial`;
            game.ctx.fillStyle = "white";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText(
                "click in the board to place your simbol",
                ScreenSize / 2,
                7 * ScreenSize / 9
            );

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
    if (game.lost_connection) {
        return;
    }

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
            if (game.winner) {
                ctx.fillStyle = "white";
                ctx.font = "bold 50px Arial";
                ctx.textAlign = "center";
                ctx.fillText(game.winner + " wins", ctx.canvas.width / 2, ctx.canvas.height / 7 * 3);
            }
        };

        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            game.clear();
            game.ctx.globalAlpha = 0.4;
            game.drawBoard();
            game.player1.draw(game.ctx, game.size);
            game.player2.draw(game.ctx, game.size);
            game.ctx.globalAlpha = 1.0;

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

