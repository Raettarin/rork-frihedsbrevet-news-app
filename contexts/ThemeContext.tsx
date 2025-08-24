import { useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import Colors from '@/constants/colors';

export type ColorScheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'frihedsbrevet_theme_preferences';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [darkModePreference, setDarkModePreference] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        setDarkModePreference(preferences.darkMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDarkMode = useCallback(async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ darkMode }));
      setDarkModePreference(darkMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);
  
  const colorScheme: ColorScheme = useMemo(() => {
    if (darkModePreference !== null) {
      return darkModePreference ? 'dark' : 'light';
    }
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }, [darkModePreference, systemColorScheme]);

  const colors = useMemo(() => Colors[colorScheme], [colorScheme]);

  return useMemo(() => ({
    colorScheme,
    colors,
    isDark: colorScheme === 'dark',
    isLoading,
    updateDarkMode,
  }), [colorScheme, colors, isLoading, updateDarkMode]);
});