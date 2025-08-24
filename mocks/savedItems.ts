import { Article, Podcast } from '@/types/content';
import { mockArticles } from './articles';
import { mockPodcasts } from './podcasts';

// Mock saved items - in a real app this would come from AsyncStorage or a backend
export const mockSavedArticles: Article[] = [
  mockArticles[0], // Climate article
  mockArticles[4], // Crime article
];

export const mockSavedPodcasts: Podcast[] = [
  mockPodcasts[2], // Sandheden Bag
];

export const mockSavedItems = {
  articles: mockSavedArticles,
  podcasts: mockSavedPodcasts,
};