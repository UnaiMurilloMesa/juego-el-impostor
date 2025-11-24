import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { saveWord, loadWords, deleteWord } from '../services/storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const AddWordsScreen = ({ navigation }: any) => {
    const [newWord, setNewWord] = useState('');
    const [wordToDelete, setWordToDelete] = useState('');

    const handleAddWord = async () => {
        if (newWord.trim().length === 0) return;

        try {
            await saveWord(newWord);
            Alert.alert('AÑADIDA', 'La palabra se ha guardado correctamente');
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

    const handleDeleteWord = async () => {
        if (wordToDelete.trim().length === 0) return;

        try {
            await deleteWord(wordToDelete);
            Alert.alert('BORRADA', 'La palabra se ha eliminado correctamente');
            setWordToDelete('');
            Keyboard.dismiss();
        } catch (error: any) {
            if (error.message === 'WORD_NOT_FOUND') {
                Alert.alert('No existe', 'Esta palabra no está en tu lista');
                setWordToDelete('');
                Keyboard.dismiss();
            } else {
                Alert.alert('Error', 'No se pudo borrar la palabra');
                console.error('Error deleting word:', error);
            }
        }
    };

    const generatePDF = async () => {
        try {
            const words = await loadWords();

            // Create HTML content for PDF
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1 {
                            color: #3b82f6;
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .word-list {
                            column-count: 2;
                            column-gap: 20px;
                        }
                        .word-item {
                            break-inside: avoid;
                            padding: 8px;
                            margin-bottom: 5px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <h1>El Impostor - Lista de Palabras</h1>
                    <p><strong>Total de palabras:</strong> ${words.length}</p>
                    <div class="word-list">
                        ${words.map((word, index) => `
                            <div class="word-item">
                                ${index + 1}. ${word}
                            </div>
                        `).join('')}
                    </div>
                    <div class="footer">
                        Generado el ${new Date().toLocaleDateString('es-ES')}
                    </div>
                </body>
                </html>
            `;

            // Generate PDF
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Share PDF
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Éxito', 'PDF generado correctamente');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF');
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

                <View style={styles.pdfButtonContainer}>
                    <Button
                        title="GENERAR PDF"
                        onPress={generatePDF}
                        variant="secondary"
                        style={styles.pdfButton}
                    />
                </View>

                <View style={styles.deleteSection}>
                    <Text style={styles.sectionTitle}>Borrar palabra</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Palabra a borrar..."
                            placeholderTextColor="#64748b"
                            value={wordToDelete}
                            onChangeText={setWordToDelete}
                            autoCapitalize="none"
                        />
                        <Button
                            title="Borrar"
                            onPress={handleDeleteWord}
                            variant="primary"
                            style={styles.addButton}
                        />
                    </View>
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
    pdfButtonContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    pdfButton: {
        width: '100%',
        maxWidth: 320,
    },
    deleteSection: {
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 16,
    },
});
