import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { TutorialModal } from '../components/TutorialModal';
import { loadPlayers } from '../services/playerStorage';

export const HomeScreen = ({ navigation }: any) => {
    const [showTutorial, setShowTutorial] = useState(false);

    const handleStartGame = async () => {
        const players = await loadPlayers();
        if (players.length < 3) {
            Alert.alert('Error', 'Necesitas al menos 3 jugadores para empezar.');
            return;
        }
        navigation.navigate('Game', { players });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <TutorialModal
                visible={showTutorial}
                onClose={() => setShowTutorial(false)}
            />

            <View style={styles.content}>
                <View style={styles.topBar}>
                    <Pressable style={styles.iconButton}>
                        <Text style={styles.iconButtonText}>ES</Text>
                    </Pressable>
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => setShowTutorial(true)}
                    >
                        <Text style={styles.iconButtonText}>?</Text>
                    </Pressable>
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>EL IMPOSTOR</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="EMPEZAR JUEGO"
                        onPress={handleStartGame}
                        variant="primary"
                        style={styles.button}
                    />
                    <Button
                        title="AÑADIR JUGADORES"
                        onPress={() => navigation.navigate('AddPlayers')}
                        variant="secondary"
                        style={styles.button}
                    />
                    <Button
                        title="AÑADIR PALABRAS"
                        onPress={() => navigation.navigate('AddWords')}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 10,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    iconButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#f8fafc',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8',
        marginTop: 8,
        letterSpacing: 1,
    },
    buttonContainer: {
        gap: 20,
        alignItems: 'center',
        marginBottom: 40,
    },
    button: {
        width: '100%',
        maxWidth: 320,
    }
});
