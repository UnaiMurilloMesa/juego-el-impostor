import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { assignImpostors, selectStartPlayer } from '../services/gameLogic';
import { loadWords } from '../services/storage';

export const GameScreen = ({ navigation, route }: any) => {
    const { players } = route.params;
    const [currentWord, setCurrentWord] = useState<string>('');
    const [impostorIndices, setImpostorIndices] = useState<number[]>([]);
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
            Alert.alert('Error', 'No hay palabras disponibles');
            navigation.goBack();
            return;
        }

        const randomWord = words[Math.floor(Math.random() * words.length)];
        const impostors = assignImpostors(players.length);

        setCurrentWord(randomWord);
        setImpostorIndices(impostors);
    };

    const finishGame = () => {
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
                    <Text style={styles.title}>¡JUEGO LISTO!</Text>
                    <Text style={styles.subtitle}>Empieza el jugador:</Text>
                    <Text style={styles.highlightText}>{startPlayer}</Text>

                    <Button
                        title="FINALIZAR"
                        onPress={() => setGamePhase('reveal_impostors')}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // Reveal impostors phase
    if (gamePhase === 'reveal_impostors') {
        const impostorNames = impostorIndices.map(idx => players[idx]);

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.title}>LOS IMPOSTORES ERAN:</Text>
                    {impostorNames.map((name, idx) => (
                        <Text key={idx} style={styles.impostorRevealText}>{name}</Text>
                    ))}

                    <Button
                        title="VOLVER AL MENÚ"
                        onPress={() => navigation.navigate('Home')}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const currentPlayerName = players[currentPlayerIndex];
    const isImpostor = impostorIndices.includes(currentPlayerIndex);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.phaseText}>
                    Jugador {currentPlayerIndex + 1} de {players.length}
                </Text>
            </View>

            <View style={styles.centerContent}>
                <Text style={styles.playerName}>{currentPlayerName}</Text>

                {isWordVisible ? (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>TU PALABRA ES:</Text>
                            <Text style={[styles.wordText, isImpostor && styles.impostorText]}>
                                {isImpostor ? 'ERES EL IMPOSTOR' : currentWord.toUpperCase()}
                            </Text>
                            <Text style={styles.cardHint}>
                                {isImpostor ? 'Intenta pasar desapercibido' : 'Memoriza tu palabra'}
                            </Text>
                        </View>
                        <View style={styles.nextButtonContainer}>
                            <Button
                                title={currentPlayerIndex === players.length - 1 ? "COMENZAR JUEGO" : "SIGUIENTE JUGADOR"}
                                onPress={handleNext}
                                variant="primary"
                                style={styles.button}
                            />
                        </View>
                    </>
                ) : (
                    <Text style={styles.instruction}>
                        Pasa el móvil a {currentPlayerName} y pulsa "Ver Palabra"
                    </Text>
                )}
            </View>

            <View style={styles.footer}>
                {!isWordVisible && (
                    <Button
                        title="VER PALABRA"
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
        marginBottom: 40,
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
        padding: 32,
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
    },
    cardTitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 1,
    },
    wordText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#3b82f6',
        textAlign: 'center',
        marginBottom: 16,
    },
    impostorText: {
        color: '#ef4444',
    },
    cardHint: {
        color: '#64748b',
        fontSize: 14,
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
});
