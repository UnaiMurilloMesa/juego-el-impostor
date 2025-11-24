import React from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { loadPlayers } from '../services/playerStorage';

export const HomeScreen = ({ navigation }: any) => {
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
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>EL IMPOSTOR</Text>
                    <Text style={styles.subtitle}>Descubre quién miente</Text>
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
        backgroundColor: '#0f172a', // Slate-900
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#f8fafc', // Slate-50
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8', // Slate-400
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
