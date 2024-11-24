import React, { useState, useEffect } from 'react';

// React navigation stack
import RootStack from '../navigators/RootStack';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from '../components/CredentialsContext';

// SplashScreen from expo-splash-screen
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(null);

  // Check if there are stored credentials
  const checkLoginCredentials = async () => {
    try {
      const result = await AsyncStorage.getItem('plotlineCredentials');
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.error('Error loading credentials from AsyncStorage:', error);
      setStoredCredentials(null); // Fallback to null if there’s an error
    }
  };

  // Show the splash screen until app is ready
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding
        await checkLoginCredentials(); // Wait for data to load
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true); // App is ready to be displayed
        SplashScreen.hideAsync(); // Hide the splash screen
      }
    };

    prepare(); // Run the preparation code when app starts
  }, []);

  if (!appReady) {
    return null; // You don't need to return anything while the app is loading
  }

  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack />
    </CredentialsContext.Provider>
  );
}
