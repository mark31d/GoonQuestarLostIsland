import React, {createContext, useContext, useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoaderScreen from './Components/LoaderScreen';
import OnboardingScreen from './Components/OnboardingScreen';
import MainTabs from './Components/MainTabs';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const Stack = createNativeStackNavigator();
const SAVED_KEY = '@goon_island_saved';
const BEST_KEY = '@goon_island_best';
const DISC_KEY = '@goon_island_disco';

export default function App() {
  const [savedStories, setSavedStories] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  const [discoveryCount, setDiscoveryCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SAVED_KEY),
      AsyncStorage.getItem(BEST_KEY),
      AsyncStorage.getItem(DISC_KEY),
    ]).then(([raw0, raw1, raw2]) => {
      if (raw0) setSavedStories(JSON.parse(raw0));
      if (raw1) setBestScore(JSON.parse(raw1));
      if (raw2) setDiscoveryCount(JSON.parse(raw2));
      setReady(true);
    });
  }, []);

  const toggleSaved = story => {
    setSavedStories(prev => {
      const exists = prev.find(s => s.id === story.id);
      const next = exists
        ? prev.filter(s => s.id !== story.id)
        : [...prev, story];
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = id => savedStories.some(s => s.id === id);

  const saveBestScore = score => {
    if (score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem(BEST_KEY, JSON.stringify(score));
    }
  };

  const bumpDiscovery = () => {
    setDiscoveryCount(c => {
      const next = c + 1;
      AsyncStorage.setItem(DISC_KEY, JSON.stringify(next));
      return next;
    });
  };

  if (!ready) return null;

  return (
    <AppContext.Provider
      value={{
        savedStories,
        toggleSaved,
        isSaved,
        bestScore,
        saveBestScore,
        discoveryCount,
        bumpDiscovery,
      }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0E0E0E" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false, animation: 'fade'}}
            initialRouteName="Loader">
            <Stack.Screen name="Loader" component={LoaderScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}
