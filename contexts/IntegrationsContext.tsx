// ADMIN/BACKEND ONLY - This context is reserved for backend plugin integrations
// Users cannot access publishing functionality from the app
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { WordPressConfig, OmnyStudioConfig } from '@/types/integrations';
import { ContentPublishingService } from '@/services/contentPublishingService';

const WORDPRESS_CONFIG_KEY = 'wordpress_config';
const OMNYSTUDIO_CONFIG_KEY = 'omnystudio_config';

export const [IntegrationsProvider, useIntegrations] = createContextHook(() => {
  const [wordPressConfig, setWordPressConfig] = useState<WordPressConfig | null>(null);
  const [omnyStudioConfig, setOmnyStudioConfig] = useState<OmnyStudioConfig | null>(null);
  const [publishingService, setPublishingService] = useState<ContentPublishingService | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<{ wordpress: boolean; omnyStudio: boolean }>({
    wordpress: false,
    omnyStudio: false,
  });

  // Load configurations from storage on mount
  useEffect(() => {
    loadConfigurations();
  }, []);

  const testConnections = useCallback(async (): Promise<void> => {
    if (!publishingService) return;

    try {
      const results = await publishingService.testConnections();
      setConnectionStatus(results);
    } catch (error) {
      console.error('Failed to test connections:', error);
      setConnectionStatus({ wordpress: false, omnyStudio: false });
    }
  }, [publishingService]);

  // Update publishing service when configs change
  useEffect(() => {
    const service = new ContentPublishingService(wordPressConfig || undefined, omnyStudioConfig || undefined);
    setPublishingService(service);
  }, [wordPressConfig, omnyStudioConfig]);

  // Test connections when service is updated
  useEffect(() => {
    if (publishingService && (wordPressConfig || omnyStudioConfig)) {
      testConnections();
    }
  }, [publishingService, wordPressConfig, omnyStudioConfig, testConnections]);

  const loadConfigurations = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const [wpConfigStr, omnyConfigStr] = await Promise.all([
        AsyncStorage.getItem(WORDPRESS_CONFIG_KEY),
        AsyncStorage.getItem(OMNYSTUDIO_CONFIG_KEY),
      ]);

      if (wpConfigStr) {
        const wpConfig = JSON.parse(wpConfigStr) as WordPressConfig;
        setWordPressConfig(wpConfig);
      }

      if (omnyConfigStr) {
        const omnyConfig = JSON.parse(omnyConfigStr) as OmnyStudioConfig;
        setOmnyStudioConfig(omnyConfig);
      }
    } catch (error) {
      console.error('Failed to load integration configurations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWordPressConfig = useCallback(async (config: WordPressConfig | null): Promise<void> => {
    try {
      if (config) {
        await AsyncStorage.setItem(WORDPRESS_CONFIG_KEY, JSON.stringify(config));
      } else {
        await AsyncStorage.removeItem(WORDPRESS_CONFIG_KEY);
      }
      setWordPressConfig(config);
    } catch (error) {
      console.error('Failed to save WordPress configuration:', error);
      throw error;
    }
  }, []);

  const updateOmnyStudioConfig = useCallback(async (config: OmnyStudioConfig | null): Promise<void> => {
    try {
      if (config) {
        await AsyncStorage.setItem(OMNYSTUDIO_CONFIG_KEY, JSON.stringify(config));
      } else {
        await AsyncStorage.removeItem(OMNYSTUDIO_CONFIG_KEY);
      }
      setOmnyStudioConfig(config);
    } catch (error) {
      console.error('Failed to save OmnyStudio configuration:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    wordPressConfig,
    omnyStudioConfig,
    publishingService,
    isLoading,
    connectionStatus,
    updateWordPressConfig,
    updateOmnyStudioConfig,
    testConnections,
  }), [
    wordPressConfig,
    omnyStudioConfig,
    publishingService,
    isLoading,
    connectionStatus,
    updateWordPressConfig,
    updateOmnyStudioConfig,
    testConnections,
  ]);
});