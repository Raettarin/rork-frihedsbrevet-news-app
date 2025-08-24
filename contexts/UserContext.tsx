import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User, UserPreferences, AuthState, defaultPreferences } from '@/types/user';

const STORAGE_KEYS = {
  USER: 'frihedsbrevet_user',
  PREFERENCES: 'frihedsbrevet_preferences',
  TOKEN: 'frihedsbrevet_token',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    preferences: defaultPreferences,
    token: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedPreferences, storedToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
      ]);

      const user = storedUser ? JSON.parse(storedUser) : null;
      const preferences = storedPreferences 
        ? { ...defaultPreferences, ...JSON.parse(storedPreferences) }
        : defaultPreferences;
      const token = storedToken;

      setAuthState({
        isAuthenticated: !!user && !!token,
        user,
        preferences,
        token,
      });
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (user: User, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      ]);

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user,
        token,
      }));
    } catch (error) {
      console.error('Error storing login data:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      ]);

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
      }));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = { ...authState.preferences, ...newPreferences };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(updatedPreferences)
      );

      setAuthState(prev => ({
        ...prev,
        preferences: updatedPreferences,
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [authState.preferences]);

  const updateUser = useCallback(async (updatedUser: Partial<User>) => {
    if (!authState.user) return;

    try {
      const newUser = { ...authState.user, ...updatedUser };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

      setAuthState(prev => ({
        ...prev,
        user: newUser,
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [authState.user]);

  const mockLogin = useCallback(async () => {
    const mockUser: User = {
      id: '1',
      name: 'Demo Bruger',
      email: 'demo@frihedsbrevet.dk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date().toISOString(),
    };
    
    await login(mockUser, 'mock-jwt-token');
  }, [login]);

  return useMemo(() => ({
    ...authState,
    isLoading,
    login,
    logout,
    updatePreferences,
    updateUser,
    mockLogin,
  }), [authState, isLoading, login, logout, updatePreferences, updateUser, mockLogin]);
});