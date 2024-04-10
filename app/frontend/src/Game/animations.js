import { clearBackground } from "./pongGameCode";
import { ScreenHeight, ScreenWidth } from "./variables";
import { drawGoal } from "./pongGameCode";

export function startGameAnimation(ctx, game) {
    return new Promise((resolve) => {
        const animate = () => {
            const current_time = Date.now();
            const elapsedTime = Math.floor(
                (current_time - game.last_time) / 1000
            );

            clearBackground(ctx);
            drawGoal(ctx, 0, 0.04 * ScreenWidth, "white");
            drawGoal(
                ctx,
                ScreenWidth - 0.04 * ScreenWidth,
                ScreenWidth,
                "white"
            );

            ctx.font = `${0.3 * ScreenWidth}px Arial`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(3 - elapsedTime, ScreenWidth / 2, ScreenHeight / 2);

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
