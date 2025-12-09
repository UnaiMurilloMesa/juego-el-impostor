import React, { useRef, useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddWordsScreen } from './src/screens/AddWordsScreen';
import { AddPlayersScreen } from './src/screens/AddPlayersScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from './src/i18n/LanguageContext';

const Stack = createNativeStackNavigator();

export default function App() {
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const { url } = event;
            if (!url) return;

            // Check if it's a file URL or custom scheme
            // Android often opens files as content:// or file://
            // We expect our scheme el-impostor:// or file matches
            console.log('Deep link received:', url);

            // Simple heuristic: if it looks like a file path or has our extension, try to import
            if (
                url.includes('.impostor') ||
                url.startsWith('file://') ||
                url.startsWith('content://')
            ) {
                // We can't access navigation directly here unless we use ref
                if (navigationRef.isReady()) {
                    // @ts-ignore
                    navigationRef.navigate('AddWords', { importUri: url });
                }
            }
        };

        // Check for initial URL
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });

        // Add listener
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <LanguageProvider>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#0f172a' }
                        }}
                    >
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="AddWords" component={AddWordsScreen} />
                        <Stack.Screen name="AddPlayers" component={AddPlayersScreen} />
                        <Stack.Screen name="Game" component={GameScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}
