import { Role } from '../types';

export const assignRoles = (totalPlayers: number): Role[] => {
    let impostorCount = 1;

    // Rules:
    // <= 4: 1 Impostor (Citizens)
    // 5-6: 1 Impostor, 1 Spy, 1 Helper
    // 7-9: 2 Impostors, 1 Spy, 1 Helper
    // > 9: 3 Impostors, 1 Spy, 1 Helper

    if (totalPlayers > 9) {
        impostorCount = 3;
    } else if (totalPlayers >= 7) {
        impostorCount = 2;
    } else {
        impostorCount = 1;
    }

    const roles: Role[] = [];

    // 1. Add Impostors
    for (let i = 0; i < impostorCount; i++) {
        roles.push('impostor');
    }

    // 2. Add Special Roles if > 4 players (so 5 or more)
    if (totalPlayers >= 5) {
        roles.push('spy');
        roles.push('helper');
    }

    // 3. Fill rest with Citizens
    const remainingSlots = totalPlayers - roles.length;
    // Safety check in case we somehow have negative slots (shouldn't happen with min 3 players)
    for (let i = 0; i < Math.max(0, remainingSlots); i++) {
        roles.push('citizen');
    }

    // 4. Shuffle roles (Fisher-Yates)
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    return roles;
};

// Deprecated but kept for compatibility logic check if needed, mostly replaced by assignRoles
export const assignImpostors = (totalPlayers: number): number[] => {
    // ... legacy logic, can be removed or kept. 
    // We will use assignRoles in GameScreen.
    const roles = assignRoles(totalPlayers);
    return roles
        .map((role, index) => role === 'impostor' ? index : -1)
        .filter(index => index !== -1);
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
