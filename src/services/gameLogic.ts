export const assignImpostors = (totalPlayers: number): number[] => {
    let impostorCount = 1;
    if (totalPlayers > 8) {
        impostorCount = 3;
    } else if (totalPlayers > 4) {
        impostorCount = 2;
    }

    const impostors = new Set<number>();
    while (impostors.size < impostorCount) {
        const randomIndex = Math.floor(Math.random() * totalPlayers);
        impostors.add(randomIndex);
    }

    return Array.from(impostors);
};

export const selectStartPlayer = (players: string[], impostorIndices: number[]): string => {
    // Create a weighted pool
    const pool: number[] = [];

    players.forEach((_, index) => {
        const isImpostor = impostorIndices.includes(index);
        // Weight: 10 for innocent, 1 for impostor
        const weight = isImpostor ? 1 : 10;
        for (let i = 0; i < weight; i++) {
            pool.push(index);
        }
    });

    const randomPoolIndex = Math.floor(Math.random() * pool.length);
    const selectedPlayerIndex = pool[randomPoolIndex];

    return players[selectedPlayerIndex];
};
