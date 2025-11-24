import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_WORDS } from '../data/defaultWords';

const STORAGE_KEY = '@el_impostor_words';

export const loadWords = async (): Promise<string[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            // First time load, save defaults
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WORDS));
            return DEFAULT_WORDS;
        }
    } catch (e) {
        console.error('Failed to load words', e);
        return DEFAULT_WORDS;
    }
};

export const saveWord = async (word: string): Promise<string[]> => {
    try {
        const normalizedWord = word.trim().toLowerCase();
        if (!normalizedWord) return await loadWords();

        const currentWords = await loadWords();

        // Check for duplicates
        if (currentWords.includes(normalizedWord)) {
            throw new Error('DUPLICATE_WORD');
        }

        const newWords = [...currentWords, normalizedWord];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWords));
        return newWords;
    } catch (e: any) {
        // Don't log duplicate word errors - they are expected
        if (e.message !== 'DUPLICATE_WORD') {
            console.error('Failed to save word', e);
        }
        throw e;
    }
};
