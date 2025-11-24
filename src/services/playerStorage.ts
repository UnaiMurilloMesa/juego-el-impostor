import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYERS_STORAGE_KEY = '@el_impostor_players';

export const loadPlayers = async (): Promise<string[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(PLAYERS_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load players', e);
        return [];
    }
};

export const savePlayers = async (players: string[]): Promise<string[]> => {
    try {
        await AsyncStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
        return players;
    } catch (e) {
        console.error('Failed to save players', e);
        throw e;
    }
};

export const addPlayer = async (name: string): Promise<string[]> => {
    try {
        const normalizedName = name.trim();
        if (!normalizedName) return await loadPlayers();

        const currentPlayers = await loadPlayers();

        // Check for duplicates (case-insensitive for better UX)
        if (currentPlayers.some(p => p.toLowerCase() === normalizedName.toLowerCase())) {
            throw new Error('DUPLICATE_PLAYER');
        }

        const newPlayers = [...currentPlayers, normalizedName];
        await savePlayers(newPlayers);
        return newPlayers;
    } catch (e) {
        throw e;
    }
};
