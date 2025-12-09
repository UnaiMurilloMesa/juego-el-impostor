import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';

interface TutorialModalProps {
    visible: boolean;
    onClose: () => void;
}

const TUTORIAL_STEPS = [
    {
        id: 1,
        title: "Organización",
        description: "Sentaos en círculo e introducid vuestros nombres en el mismo orden en el que estáis sentados."
    },
    {
        id: 2,
        title: "Tu Turno",
        description: "Pasad el móvil de uno en uno con cuidado. Cada jugador verá su palabra secreta o si es el impostor."
    },
    {
        id: 3,
        title: "¿Eres el Impostor?",
        description: "Si no ves ninguna palabra... ¡tú eres el impostor! Disimula, escucha a los demás e intenta averiguar de qué están hablando."
    },
    {
        id: 4,
        title: "¿Eres Inocente?",
        description: "Lee tu palabra y di una pista relacionada con ella. ¡Pero cuidado! Si es demasiado obvia, el Impostor sabrá la palabra."
    },
    {
        id: 5,
        title: "La Votación",
        description: "Al acabar la ronda, votad quién creéis que miente. Si expulsáis al Impostor, ganáis. ¡Pero cuidado con echar a vuestros compañeros inocentes!"
    },
    {
        id: 6,
        title: "Número de Impostores",
        description: "Menos de 4 jugadores = 1 impostor. Menos de 8 = 2 impostores. Más de 8 = 3 impostores. ¡Estad atentos!"
    },
    {
        id: 7,
        title: "¡A Jugar!",
        description: "¡Eso es todo! Que empiece el juego y... ¡cazad al impostor!"
    }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable style={styles.closeButton} onPress={handleClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </Pressable>

                    <View style={styles.contentContainer}>
                        <Text style={styles.stepTitle}>
                            {TUTORIAL_STEPS[currentStep].title}
                        </Text>
                        <ScrollView style={styles.scrollView}>
                            <Text style={styles.stepDescription}>
                                {TUTORIAL_STEPS[currentStep].description}
                            </Text>
                        </ScrollView>

                        <View style={styles.progressContainer}>
                            {TUTORIAL_STEPS.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === currentStep ? styles.activeDot : styles.inactiveDot
                                    ]}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Pressable
                            style={[styles.button, currentStep === 0 && styles.buttonDisabled]}
                            onPress={handlePrev}
                            disabled={currentStep === 0}
                        >
                            <Text style={[styles.buttonText, currentStep === 0 && styles.buttonTextDisabled]}>
                                Anterior
                            </Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.primaryButton]} onPress={handleNext}>
                            <Text style={styles.primaryButtonText}>
                                {currentStep === TUTORIAL_STEPS.length - 1 ? "Entendido" : "Siguiente"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 20,
    },
    modalView: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#334155',
        minHeight: 400,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 8,
        zIndex: 1,
    },
    closeButtonText: {
        color: '#94a3b8',
        fontSize: 24,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 16,
        textAlign: 'center',
    },
    scrollView: {
        width: '100%',
        maxHeight: 200,
    },
    stepDescription: {
        fontSize: 18,
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 28,
    },
    progressContainer: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: '#3b82f6',
        width: 24,
    },
    inactiveDot: {
        backgroundColor: '#475569',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        flex: 1,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#cbd5e1',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextDisabled: {
        color: '#64748b',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
