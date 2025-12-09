import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'default' | 'small';
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'default', style }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const buttonStyles = [
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        size === 'small' && styles.smallButton
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' ? styles.primaryText : styles.secondaryText,
        size === 'small' && styles.smallText
    ];

    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={buttonStyles}
            >
                <Text style={textStyles}>
                    {title}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    smallButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        minWidth: 100,
        borderRadius: 12,
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    smallText: {
        fontSize: 14,
    },
    primaryText: {
        color: '#ffffff',
    },
    secondaryText: {
        color: '#3b82f6',
    },
});
