import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_WORDS } from '../data/defaultWords';
import { Word } from '../types';

const STORAGE_KEY = '@el_impostor_words_v2';

export const loadWords = async (): Promise<Word[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WORDS));
            return DEFAULT_WORDS;
        }
    } catch (e) {
        console.error('Failed to load words', e);
        return DEFAULT_WORDS;
    }
};

export const saveWord = async (wordText: string): Promise<Word[]> => {
    try {
        const normalizedWord = wordText.trim();
        if (!normalizedWord) return await loadWords();

        const currentWords = await loadWords();

        const exists = currentWords.some(w =>
            w.es.toLowerCase() === normalizedWord.toLowerCase() ||
            w.en.toLowerCase() === normalizedWord.toLowerCase()
        );

        if (exists) {
            throw new Error('DUPLICATE_WORD');
        }

        const newWord: Word = { es: normalizedWord, en: normalizedWord };

        const newWords = [...currentWords, newWord];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWords));
        return newWords;
    } catch (e: any) {
        if (e.message !== 'DUPLICATE_WORD') {
            console.error('Failed to save word', e);
        }
        throw e;
    }
};

export const deleteWord = async (wordToDelete: Word): Promise<Word[]> => {
    try {
        const currentWords = await loadWords();

        const exists = currentWords.some(w => w.es === wordToDelete.es && w.en === wordToDelete.en);
        if (!exists) {
            throw new Error('WORD_NOT_FOUND');
        }

        const newWords = currentWords.filter(w => w.es !== wordToDelete.es || w.en !== wordToDelete.en);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWords));
        return newWords;
    } catch (e: any) {
        if (e.message !== 'WORD_NOT_FOUND') {
            console.error('Failed to delete word', e);
        }
        throw e;
    }
};

export interface ImportResult {
    added: number;
    skipped: number;
}

export const importWords = async (importedWords: any[]): Promise<ImportResult> => {
    try {
        const currentWords = await loadWords();
        let addedCount = 0;
        let skippedCount = 0;
        const newWordsToAdd: Word[] = [];

        for (const item of importedWords) {
            // Validate item structure
            let es = '';
            let en = '';

            if (typeof item === 'string') {
                es = item.trim();
                en = item.trim();
            } else if (typeof item === 'object' && item.es) {
                // Support both full object or partial
                es = item.es.trim();
                en = item.en ? item.en.trim() : es; // Fallback to es if en missing
            } else {
                continue; // Invalid format
            }

            if (!es) continue;

            // Check duplicates
            const exists = currentWords.some(w =>
                w.es.toLowerCase() === es.toLowerCase() ||
                w.en.toLowerCase() === en.toLowerCase()
            );

            if (exists) {
                skippedCount++;
            } else {
                newWordsToAdd.push({ es, en });
                addedCount++;
            }
        }

        if (addedCount > 0) {
            const finalWords = [...currentWords, ...newWordsToAdd];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalWords));
        }

        return { added: addedCount, skipped: skippedCount };
    } catch (e) {
        console.error('Failed to import words', e);
        throw e;
    }
};
