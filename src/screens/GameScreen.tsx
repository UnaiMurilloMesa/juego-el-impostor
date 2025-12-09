import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { assignRoles, selectStartPlayer } from '../services/gameLogic';
import { loadWords } from '../services/storage';
import { useLanguage } from '../i18n/LanguageContext';
import { Word, Role } from '../types';

export const GameScreen = ({ navigation, route }: any) => {
    const { players } = route.params;
    const { t, language } = useLanguage();

    // We store the full Word object so we can show it in the correct language
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isWordVisible, setIsWordVisible] = useState(false);
    const [gamePhase, setGamePhase] = useState<'playing' | 'reveal_start' | 'reveal_impostors'>('playing');
    const [startPlayer, setStartPlayer] = useState<string>('');

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = async () => {
        const words = await loadWords();
        if (words.length === 0) {
            Alert.alert(t('ERROR_TITLE'), 'No words available');
            navigation.goBack();
            return;
        }

        const randomWord = words[Math.floor(Math.random() * words.length)];
        const newRoles = assignRoles(players.length);

        setCurrentWord(randomWord);
        setRoles(newRoles);
    };

    const finishGame = () => {
        // Need to get impostor indices for legacy support of selectStartPlayer or update it
        // For now, let's just find indices of impostors for selectStartPlayer
        const impostorIndices = roles
            .map((r, i) => r === 'impostor' ? i : -1)
            .filter(i => i !== -1);

        const starter = selectStartPlayer(players, impostorIndices);
        setStartPlayer(starter);
        setGamePhase('reveal_start');
    };

    const handleNext = () => {
        setIsWordVisible(false);
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        } else {
            finishGame();
        }
    };

    const handleReveal = () => {
        setIsWordVisible(true);
    };

    // Reveal start player phase
    if (gamePhase === 'reveal_start') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.title}>{t('GAME_TITLE')}</Text>
                    <Text style={styles.subtitle}>{t('VOTE_TIME')}</Text>
                    <Text style={styles.highlightText}>{startPlayer}</Text>

                    <Button
                        title={t('TUTORIAL_NEXT')}
                        onPress={() => setGamePhase('reveal_impostors')}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // Reveal impostors phase (Show all roles)
    if (gamePhase === 'reveal_impostors') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.title}>{t('ROUND_FINISHED')}</Text>

                    <ScrollView style={{ width: '100%', maxHeight: '60%' }}>
                        {players.map((name: string, idx: number) => {
                            const role = roles[idx];
                            let roleColor = '#f8fafc'; // Default
                            if (role === 'impostor') roleColor = '#ef4444';
                            if (role === 'spy') roleColor = '#f59e0b';
                            if (role === 'helper') roleColor = '#a855f7';

                            return (
                                <View key={idx} style={styles.roleResultRow}>
                                    <Text style={styles.resultName}>{name}:</Text>
                                    <Text style={[styles.resultRole, { color: roleColor }]}>
                                        {role === 'impostor' ? t('IMPOSTOR_LABEL') :
                                            role === 'spy' ? t('SPY_LABEL') :
                                                role === 'helper' ? t('HELPER_LABEL') :
                                                    t('CITIZEN_LABEL')}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <Button
                        title={t('EXIT')}
                        onPress={() => navigation.navigate('Home')}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const currentPlayerName = players[currentPlayerIndex];
    const currentRole = roles[currentPlayerIndex];
    const displayWord = currentWord ? currentWord[language] : '';

    const getRoleContent = () => {
        if (currentRole === 'impostor') {
            return {
                title: t('IMPOSTOR_LABEL'),
                word: t('IMPOSTOR_LABEL'), // Or leave empty/special text
                hint: t('TUTORIAL_DESC_3'),
                isImpostor: true,
                color: '#ef4444'
            };
        } else if (currentRole === 'spy') {
            // Spy sees the impostors
            const impostorNames = players.filter((_p: string, idx: number) => roles[idx] === 'impostor').join(', ');
            return {
                title: t('SPY_LABEL'),
                word: displayWord.toUpperCase(),
                hint: t('SPY_GOAL').replace('{0}', impostorNames),
                isImpostor: false,
                color: '#f59e0b' // Amber
            };
        } else if (currentRole === 'helper') {
            return {
                title: t('HELPER_LABEL'),
                word: displayWord.toUpperCase(),
                hint: t('HELPER_GOAL'),
                isImpostor: false,
                color: '#a855f7' // Purple
            };
        } else {
            // Citizen
            return {
                title: t('SECRET_WORD_LABEL'),
                word: displayWord.toUpperCase(),
                hint: t('TUTORIAL_DESC_4'),
                isImpostor: false,
                color: '#3b82f6' // Blue
            };
        }
    };

    const content = getRoleContent();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.phaseText}>
                    {t('PLAYERS_TITLE')} {currentPlayerIndex + 1} / {players.length}
                </Text>
            </View>

            <View style={styles.centerContent}>
                <Text style={styles.playerName}>{currentPlayerName}</Text>

                {isWordVisible ? (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{content.title}</Text>
                            <Text style={[styles.wordText, { color: content.color }]}>
                                {content.word}
                            </Text>
                            <ScrollView style={styles.hintContainer}>
                                <Text style={styles.cardHint}>
                                    {content.hint}
                                </Text>
                            </ScrollView>
                        </View>
                        <View style={styles.nextButtonContainer}>
                            <Button
                                title={currentPlayerIndex === players.length - 1 ? t('START_GAME') : t('TUTORIAL_NEXT').toUpperCase()}
                                onPress={handleNext}
                                variant="primary"
                                style={styles.button}
                            />
                        </View>
                    </>
                ) : (
                    <Text style={styles.instruction}>
                        {t('PASS_DEVICE')}
                    </Text>
                )}
            </View>

            <View style={styles.footer}>
                {!isWordVisible && (
                    <Button
                        title={t('SHOW_ROLE')}
                        onPress={handleReveal}
                        variant="secondary"
                        style={styles.button}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        padding: 16,
        alignItems: 'center',
    },
    phaseText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    nextButtonContainer: {
        marginTop: 32,
        width: '100%',
        alignItems: 'center',
    },
    playerName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f8fafc',
        marginBottom: 20,
        textAlign: 'center',
    },
    instruction: {
        fontSize: 18,
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 28,
    },
    card: {
        backgroundColor: '#1e293b',
        padding: 24,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        minHeight: 300, // Make card taller
        justifyContent: 'center',
    },
    cardTitle: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 20,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    wordText: {
        fontSize: 36, // Bigger font
        fontWeight: '900',
        color: '#3b82f6',
        textAlign: 'center',
        marginBottom: 24,
    },
    impostorText: {
        color: '#ef4444',
        fontSize: 28, // Adjust for longer text if needed
    },
    hintContainer: {
        width: '100%',
        maxHeight: 150,
    },
    cardHint: {
        color: '#94a3b8',
        fontSize: 18, // Bigger font for readability
        textAlign: 'center',
        lineHeight: 26,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#f8fafc',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8',
        marginBottom: 12,
        textAlign: 'center',
    },
    highlightText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#3b82f6',
        marginBottom: 48,
        textAlign: 'center',
    },
    impostorRevealText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        maxWidth: 320,
    },
    roleResultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        width: '100%',
    },
    resultName: {
        fontSize: 18,
        color: '#f8fafc',
        fontWeight: '600',
    },
    resultRole: {
        fontSize: 18,
        fontWeight: '700',
    },
});
