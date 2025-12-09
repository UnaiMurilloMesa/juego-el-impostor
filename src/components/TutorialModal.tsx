import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

interface TutorialModalProps {
    visible: boolean;
    onClose: () => void;
}

const TUTORIAL_STEPS_CONFIG = [
    { id: 1, image: require('../../assets/paso1.png') },
    { id: 2, image: require('../../assets/paso2.png') },
    { id: 3, image: require('../../assets/paso3.png') },
    { id: 4, image: require('../../assets/paso4.png') },
    { id: 5, image: require('../../assets/paso5.png') },
    { id: 6, image: undefined },
    { id: 7, image: require('../../assets/paso7.png') }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { t } = useLanguage();

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS_CONFIG.length - 1) {
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

    const currentConfig = TUTORIAL_STEPS_CONFIG[currentStep];
    const titleKey = `TUTORIAL_TITLE_${currentConfig.id}`;
    const descKey = `TUTORIAL_DESC_${currentConfig.id}`;

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
                            {t(titleKey as any)}
                        </Text>

                        {currentConfig.image && (
                            <Image
                                source={currentConfig.image}
                                style={styles.stepImage}
                                resizeMode="contain"
                            />
                        )}

                        <ScrollView style={styles.scrollView}>
                            <Text style={styles.stepDescription}>
                                {t(descKey as any)}
                            </Text>
                        </ScrollView>

                        <View style={styles.progressContainer}>
                            {TUTORIAL_STEPS_CONFIG.map((_, index) => (
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
                                {t('TUTORIAL_PREV')}
                            </Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.primaryButton]} onPress={handleNext}>
                            <Text style={styles.primaryButtonText}>
                                {currentStep === TUTORIAL_STEPS_CONFIG.length - 1 ? t('TUTORIAL_DONE') : t('TUTORIAL_NEXT')}
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
        maxWidth: 500,
        height: '90%',
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
        marginTop: 30,
        marginBottom: 10,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 20,
        textAlign: 'center',
    },
    stepImage: {
        width: '100%',
        height: '45%',
        marginBottom: 20,
        borderRadius: 12,
    },
    scrollView: {
        width: '100%',
        flex: 1,
    },
    stepDescription: {
        fontSize: 18,
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 28,
        paddingHorizontal: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 8,
        marginBottom: 10,
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
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    button: {
        paddingVertical: 14,
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
