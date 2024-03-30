export function logError(message) {
    console.log("\x1b[31mError\x1b[0m: " + message);
}

export function log(message) {
    console.log("\x1b[32m" + message.toUpperCase() + "\x1b[0m");
}