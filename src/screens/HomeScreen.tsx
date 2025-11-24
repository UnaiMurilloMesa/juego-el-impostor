import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Button } from '../components/Button';

export const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>EL IMPOSTOR</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="EMPEZAR JUEGO"
                        onPress={() => console.log('Empezar Juego pressed')}
                        variant="primary"
                        style={styles.button}
                    />
                    <Button
                        title="AÑADIR PALABRAS"
                        onPress={() => console.log('Añadir Palabras pressed')}
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
