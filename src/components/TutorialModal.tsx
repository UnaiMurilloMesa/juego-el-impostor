import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

interface TutorialModalProps {
    visible: boolean;
    onClose: () => void;
}

interface TutorialStep {
    id: number;
    title?: string;
    description?: string;
    image?: any;
    customContent?: (t: any, styles: any) => React.ReactNode;
}

const TUTORIAL_STEPS_CONFIG: TutorialStep[] = [
    { id: 1, image: require('../../assets/paso1.png') },
    {
        id: 99, // Special ID for roles
        title: 'PLAYERS_TITLE',
        customContent: (t: any, styles: any) => (
            <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <Text style={styles.roleTitle}>{t('CITIZEN_LABEL')}</Text>
                <Text style={styles.roleDesc}>{t('ROLE_DESC_CITIZEN')}</Text>

                <Text style={[styles.roleTitle, { color: '#ef4444' }]}>{t('IMPOSTOR_LABEL')}</Text>
                <Text style={styles.roleDesc}>{t('ROLE_DESC_IMPOSTOR')}</Text>

                <Text style={[styles.roleTitle, { color: '#f59e0b' }]}>{t('SPY_LABEL')}</Text>
                <Text style={styles.roleDesc}>{t('ROLE_DESC_SPY')}</Text>

                <Text style={[styles.roleTitle, { color: '#a855f7' }]}>{t('HELPER_LABEL')}</Text>
                <Text style={styles.roleDesc}>{t('ROLE_DESC_HELPER')}</Text>
            </View>
        )
    },
    { id: 2, image: require('../../assets/paso2.png') },
    { id: 3, image: require('../../assets/paso3.png') },
    { id: 4, image: require('../../assets/paso4.png') },
    { id: 5, image: require('../../assets/paso5.png') },
    {
        id: 6,
        image: undefined,
        customContent: (t: any, styles: any) => (
            <View style={{ width: '100%', paddingHorizontal: 10 }}>
                {/* <= 4 Players */}
                <View style={styles.ruleRow}>
                    <Text style={styles.ruleRange}>≤ 4</Text>
                    <View style={styles.ruleContent}>
                        <Text style={[styles.ruleText, { color: '#ef4444' }]}>1 Impostor</Text>
                    </View>
                </View>

                {/* 5-6 Players */}
                <View style={styles.ruleRow}>
                    <Text style={styles.ruleRange}>5 - 6</Text>
                    <View style={styles.ruleContent}>
                        <Text style={[styles.ruleText, { color: '#ef4444' }]}>1 {t('IMPOSTOR_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#f59e0b' }]}>1 {t('SPY_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#a855f7' }]}>1 {t('HELPER_WORD')}</Text>
                    </View>
                </View>

                {/* 7-9 Players */}
                <View style={styles.ruleRow}>
                    <Text style={styles.ruleRange}>7 - 9</Text>
                    <View style={styles.ruleContent}>
                        <Text style={[styles.ruleText, { color: '#ef4444' }]}>2 {t('IMPOSTOR_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#f59e0b' }]}>1 {t('SPY_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#a855f7' }]}>1 {t('HELPER_WORD')}</Text>
                    </View>
                </View>

                {/* 10+ Players */}
                <View style={styles.ruleRow}>
                    <Text style={styles.ruleRange}>10+</Text>
                    <View style={styles.ruleContent}>
                        <Text style={[styles.ruleText, { color: '#ef4444' }]}>3 {t('IMPOSTOR_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#f59e0b' }]}>1 {t('SPY_WORD')}</Text>
                        <Text style={[styles.ruleText, { color: '#a855f7' }]}>1 {t('HELPER_WORD')}</Text>
                    </View>
                </View>
            </View>
        )
    },
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
    // Use config title if available, else derive from ID
    const titleKey = currentConfig.title || `TUTORIAL_TITLE_${currentConfig.id}`;
    const descKey = currentConfig.description || `TUTORIAL_DESC_${currentConfig.id}`;

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

                        {currentConfig.customContent ? (
                            <ScrollView style={styles.scrollView}>
                                {currentConfig.customContent(t, styles)}
                            </ScrollView>
                        ) : (
                            <>
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
                            </>
                        )}

                        <View style={styles.paginationContainer}>
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
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#334155',
    },
    activeDot: {
        backgroundColor: '#3b82f6',
        width: 20,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
        marginTop: 10,
        marginBottom: 2,
    },
    roleDesc: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
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
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#1e293b',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 8,
    },
    ruleRange: {
        fontSize: 24,
        fontWeight: '800',
        color: '#cbd5e1',
        width: 80,
    },
    ruleContent: {
        flex: 1,
        flexDirection: 'column',
    },
    ruleText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
});
