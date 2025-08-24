import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Article, Podcast } from '@/types/content';

const STORAGE_KEYS = {
  SAVED_ARTICLES: 'frihedsbrevet_saved_articles',
  SAVED_PODCASTS: 'frihedsbrevet_saved_podcasts',
};

interface SavedItemsState {
  savedArticles: Article[];
  savedPodcasts: Podcast[];
  isLoading: boolean;
}

export const [SavedItemsProvider, useSavedItems] = createContextHook(() => {
  const [state, setState] = useState<SavedItemsState>({
    savedArticles: [],
    savedPodcasts: [],
    isLoading: true,
  });

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      const [savedArticlesData, savedPodcastsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_PODCASTS),
      ]);

      const savedArticles = savedArticlesData ? JSON.parse(savedArticlesData) : [];
      const savedPodcasts = savedPodcastsData ? JSON.parse(savedPodcastsData) : [];

      setState({
        savedArticles,
        savedPodcasts,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading saved items:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const saveArticle = useCallback(async (article: Article) => {
    try {
      const updatedArticles = [...state.savedArticles, article];
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(updatedArticles));
      
      setState(prev => ({
        ...prev,
        savedArticles: updatedArticles,
      }));
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }, [state.savedArticles]);

  const unsaveArticle = useCallback(async (articleId: string) => {
    try {
      const updatedArticles = state.savedArticles.filter(article => article.id !== articleId);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(updatedArticles));
      
      setState(prev => ({
        ...prev,
        savedArticles: updatedArticles,
      }));
    } catch (error) {
      console.error('Error unsaving article:', error);
      throw error;
    }
  }, [state.savedArticles]);

  const savePodcast = useCallback(async (podcast: Podcast) => {
    try {
      const updatedPodcasts = [...state.savedPodcasts, podcast];
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PODCASTS, JSON.stringify(updatedPodcasts));
      
      setState(prev => ({
        ...prev,
        savedPodcasts: updatedPodcasts,
      }));
    } catch (error) {
      console.error('Error saving podcast:', error);
      throw error;
    }
  }, [state.savedPodcasts]);

  const unsavePodcast = useCallback(async (podcastId: string) => {
    try {
      const updatedPodcasts = state.savedPodcasts.filter(podcast => podcast.id !== podcastId);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PODCASTS, JSON.stringify(updatedPodcasts));
      
      setState(prev => ({
        ...prev,
        savedPodcasts: updatedPodcasts,
      }));
    } catch (error) {
      console.error('Error unsaving podcast:', error);
      throw error;
    }
  }, [state.savedPodcasts]);

  const isArticleSaved = useCallback((articleId: string) => {
    return state.savedArticles.some(article => article.id === articleId);
  }, [state.savedArticles]);

  const isPodcastSaved = useCallback((podcastId: string) => {
    return state.savedPodcasts.some(podcast => podcast.id === podcastId);
  }, [state.savedPodcasts]);

  const toggleArticleSave = useCallback(async (article: Article) => {
    if (isArticleSaved(article.id)) {
      await unsaveArticle(article.id);
    } else {
      await saveArticle(article);
    }
  }, [isArticleSaved, saveArticle, unsaveArticle]);

  const togglePodcastSave = useCallback(async (podcast: Podcast) => {
    if (isPodcastSaved(podcast.id)) {
      await unsavePodcast(podcast.id);
    } else {
      await savePodcast(podcast);
    }
  }, [isPodcastSaved, savePodcast, unsavePodcast]);

  return useMemo(() => ({
    ...state,
    saveArticle,
    unsaveArticle,
    savePodcast,
    unsavePodcast,
    isArticleSaved,
    isPodcastSaved,
    toggleArticleSave,
    togglePodcastSave,
  }), [state, saveArticle, unsaveArticle, savePodcast, unsavePodcast, isArticleSaved, isPodcastSaved, toggleArticleSave, togglePodcastSave]);
});