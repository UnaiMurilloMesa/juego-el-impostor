import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { saveWord } from '../services/storage';

export const AddWordsScreen = ({ navigation }: any) => {
    const [newWord, setNewWord] = useState('');

    const handleAddWord = async () => {
        if (newWord.trim().length === 0) return;

        try {
            await saveWord(newWord);
            Alert.alert('¡Añadida!', 'La palabra se ha guardado correctamente');
            setNewWord('');
            Keyboard.dismiss();
        } catch (error: any) {
            if (error.message === 'DUPLICATE_WORD') {
                Alert.alert('Ya existe', 'Esta palabra ya está en tu lista');
                setNewWord('');
                Keyboard.dismiss();
            } else {
                // Only show error for actual failures
                Alert.alert('Error', 'No se pudo guardar la palabra');
                console.error('Error saving word:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Añadir Palabras</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Añade nuevas palabras para jugar.
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva palabra..."
                        placeholderTextColor="#64748b"
                        value={newWord}
                        onChangeText={setNewWord}
                        autoCapitalize="none"
                    />
                    <Button
                        title="Añadir"
                        onPress={handleAddWord}
                        variant="primary"
                        style={styles.addButton}
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
    description: {
        color: '#94a3b8',
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
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
});
