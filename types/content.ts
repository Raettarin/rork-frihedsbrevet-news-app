export interface Article {
  id: string;
  title: string;
  coverImage: string;
  journalist: string;
  publishedAt: string;
  readTime: number;
  category: string;
  excerpt: string;
  content: string;
  audioUrl?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedAt: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface Podcast {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  category: string;
  totalSeasons: number;
  totalEpisodes: number;
  episodes: PodcastEpisode[];
  audioUrl?: string; // URL for the latest episode or preview
}