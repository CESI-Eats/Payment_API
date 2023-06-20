export function acceptPayment(): string {
    const successChance = 0.8; // 80% chance of success
    const randomValue = Math.random();

    if (randomValue < successChance) {
        return "Success";
    } else {
        return "Failed";
    }
}