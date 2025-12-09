import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { saveWord, loadWords, deleteWord, importWords } from '../services/storage';
import { useLanguage } from '../i18n/LanguageContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

export const AddWordsScreen = ({ navigation }: any) => {
    const { t, language } = useLanguage();
    const [newWord, setNewWord] = useState('');
    const [wordToDelete, setWordToDelete] = useState('');
    const params = (navigation.getState().routes.find((r: any) => r.name === 'AddWords')?.params) || {};

    useEffect(() => {
        if (params?.importUri) {
            handleImportFile(params.importUri);
            // Clear params to avoid loop if necessary, though navigation stack usually handles it
            navigation.setParams({ importUri: undefined });
        }
    }, [params?.importUri]);

    const handleAddWord = async () => {
        if (newWord.trim().length === 0) return;

        try {
            await saveWord(newWord);
            Alert.alert(t('WORD_ADDED'), t('WORD_ADDED_MSG'));
            setNewWord('');
            Keyboard.dismiss();
        } catch (error: any) {
            if (error.message === 'DUPLICATE_WORD') {
                Alert.alert(t('WORD_EXISTS'), t('WORD_EXISTS'));
            } else {
                Alert.alert(t('ERROR_TITLE'), 'Could not save word');
            }
        }
    };

    const handleDeleteWord = async () => {
        if (wordToDelete.trim().length === 0) return;

        try {
            const words = await loadWords();
            const normalizedInput = wordToDelete.trim().toLowerCase();

            const targetWord = words.find(w =>
                w.es.toLowerCase() === normalizedInput ||
                w.en.toLowerCase() === normalizedInput
            );

            if (!targetWord) {
                throw new Error('WORD_NOT_FOUND');
            }

            await deleteWord(targetWord);
            Alert.alert('Deleted', 'Word deleted successfully');
            setWordToDelete('');
            Keyboard.dismiss();
        } catch (error: any) {
            if (error.message === 'WORD_NOT_FOUND') {
                Alert.alert(t('ERROR_TITLE'), 'Word not found');
            } else {
                Alert.alert(t('ERROR_TITLE'), 'Could not delete word');
                console.error('Error deleting word:', error);
            }
        }
    };

    const generatePDF = async () => {
        try {
            const words = await loadWords();
            const title = language === 'es' ? 'El Impostor - Lista de Palabras' : 'The Impostor - Word List';

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #3b82f6; text-align: center; margin-bottom: 30px; }
                        .word-list { column-count: 2; column-gap: 20px; }
                        .word-item { break-inside: avoid; padding: 8px; margin-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
                        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <p><strong>Total:</strong> ${words.length}</p>
                    <div class="word-list">
                        ${words.map((word, index) => `
                            <div class="word-item">
                                ${index + 1}. ${word[language]}
                            </div>
                        `).join('')}
                    </div>
                    <div class="footer">
                        Generated: ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                    </div>
                </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Success', 'PDF generated');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert(t('ERROR_TITLE'), 'Could not generate PDF');
        }
    };

    const handleExportJSON = async () => {
        try {
            const words = await loadWords();
            const jsonString = JSON.stringify(words, null, 2);
            // Use .impostor extension
            const fileUri = FileSystem.documentDirectory + 'el-impostor-words.impostor';

            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json', // Or application/octet-stream
                    UTI: 'public.json'
                });
            } else {
                Alert.alert('Success', 'File saved to documents');
            }
        } catch (error) {
            console.error('Error exporting JSON:', error);
            Alert.alert(t('ERROR_TITLE'), 'Could not export list');
        }
    };

    const handleImportFile = async (uri: string) => {
        try {
            const fileContent = await FileSystem.readAsStringAsync(uri);

            let importedData;
            try {
                importedData = JSON.parse(fileContent);
            } catch (e) {
                Alert.alert(t('IMPORT_ERROR'), 'Invalid file format');
                return;
            }

            if (!Array.isArray(importedData)) {
                Alert.alert(t('IMPORT_ERROR'), 'Invalid structure (expected array)');
                return;
            }

            const { added, skipped } = await importWords(importedData);

            const msg = t('IMPORT_SUCCESS_MSG')
                .replace('{0}', added.toString())
                .replace('{1}', skipped.toString());

            Alert.alert(t('IMPORT_SUCCESS'), msg);
        } catch (error) {
            console.error('Error importing file:', error);
            Alert.alert(t('IMPORT_ERROR'), 'Could not import list');
        }
    };

    const handleImportJSON = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Allow all, looking for .impostor or .json
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;
            await handleImportFile(fileUri);

        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert(t('IMPORT_ERROR'), 'Could not pick file');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← {t('BACK_BTN')}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{t('WORDS_TITLE')}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={t('ADD_WORD_PLACEHOLDER')}
                        placeholderTextColor="#64748b"
                        value={newWord}
                        onChangeText={setNewWord}
                        autoCapitalize="none"
                    />
                    <Button
                        title={t('ADD_WORD_BTN')}
                        onPress={handleAddWord}
                        variant="primary"
                        style={styles.addButton}
                    />
                </View>

                <View style={styles.actionButtons}>
                    <Button
                        title={t('GENERATE_PDF')}
                        onPress={generatePDF}
                        variant="secondary"
                        style={styles.actionBtn}
                    />
                    <View style={styles.rowButtons}>
                        <Button
                            title={t('EXPORT_JSON')}
                            onPress={handleExportJSON}
                            variant="secondary"
                            size="small"
                            style={styles.halfBtn}
                        />
                        <Button
                            title={t('IMPORT_JSON')}
                            onPress={handleImportJSON}
                            variant="secondary"
                            size="small"
                            style={styles.halfBtn}
                        />
                    </View>
                </View>

                <View style={styles.deleteSection}>
                    <Text style={styles.sectionTitle}>{t('DELETE')}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('ADD_WORD_PLACEHOLDER')}
                            placeholderTextColor="#64748b"
                            value={wordToDelete}
                            onChangeText={setWordToDelete}
                            autoCapitalize="none"
                        />
                        <Button
                            title={t('DELETE')}
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
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
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
    actionButtons: {
        gap: 12,
    },
    actionBtn: {
        width: '100%',
    },
    rowButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    halfBtn: {
        flex: 1,
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
