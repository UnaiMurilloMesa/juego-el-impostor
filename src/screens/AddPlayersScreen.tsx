import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { loadPlayers, addPlayer, savePlayers } from '../services/playerStorage';

export const AddPlayersScreen = ({ navigation }: any) => {
    const [players, setPlayers] = useState<string[]>([]);
    const [newPlayer, setNewPlayer] = useState('');

    useEffect(() => {
        loadPlayers().then(setPlayers);
    }, []);

    const handleAddPlayer = async () => {
        if (newPlayer.trim().length === 0) return;

        try {
            const updatedPlayers = await addPlayer(newPlayer);
            setPlayers(updatedPlayers);
            setNewPlayer('');
            Keyboard.dismiss();
        } catch (error: any) {
            if (error.message === 'DUPLICATE_PLAYER') {
                Alert.alert('Error', 'Este jugador ya está en la lista');
            } else {
                Alert.alert('Error', 'No se pudo añadir el jugador');
            }
        }
    };

    const handleDeletePlayer = async (index: number) => {
        const updatedPlayers = players.filter((_, i) => i !== index);
        await savePlayers(updatedPlayers);
        setPlayers(updatedPlayers);
    };

    const movePlayer = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === players.length - 1)
        ) return;

        const newPlayers = [...players];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newPlayers[index], newPlayers[targetIndex]] = [newPlayers[targetIndex], newPlayers[index]];

        await savePlayers(newPlayers);
        setPlayers(newPlayers);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Jugadores</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del jugador..."
                        placeholderTextColor="#64748b"
                        value={newPlayer}
                        onChangeText={setNewPlayer}
                    />
                    <Button
                        title="Añadir"
                        onPress={handleAddPlayer}
                        variant="primary"
                        style={styles.addButton}
                    />
                </View>

                <Text style={styles.listTitle}>Lista de Jugadores ({players.length})</Text>
                <FlatList
                    data={players}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item, index }) => (
                        <View style={styles.playerItem}>
                            <Text style={styles.playerName}>{index + 1}. {item}</Text>

                            <View style={styles.actions}>
                                <View style={styles.moveButtons}>
                                    <TouchableOpacity
                                        onPress={() => movePlayer(index, 'up')}
                                        disabled={index === 0}
                                        style={[styles.iconButton, index === 0 && styles.disabledButton]}
                                    >
                                        <Text style={styles.iconText}>▲</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => movePlayer(index, 'down')}
                                        disabled={index === players.length - 1}
                                        style={[styles.iconButton, index === players.length - 1 && styles.disabledButton]}
                                    >
                                        <Text style={styles.iconText}>▼</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleDeletePlayer(index)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
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
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    backButtonText: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f8fafc',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        color: '#f8fafc',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    addButton: {
        minWidth: 100,
        paddingVertical: 0,
        paddingHorizontal: 0,
        height: '100%',
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 12,
    },
    listContent: {
        gap: 8,
        paddingBottom: 20,
    },
    playerItem: {
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    playerName: {
        color: '#e2e8f0',
        fontSize: 16,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    moveButtons: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: '#0f172a',
        borderRadius: 8,
        padding: 4,
    },
    iconButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#334155',
    },
    disabledButton: {
        opacity: 0.3,
    },
    iconText: {
        color: '#f8fafc',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 8,
    },
    deleteText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
