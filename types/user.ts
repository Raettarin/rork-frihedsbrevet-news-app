export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    breakingNews: boolean;
    newEpisodes: boolean;
    recommendations: boolean;
  };
  autoPlay: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  preferences: UserPreferences;
  token: string | null;
}

export const defaultPreferences: UserPreferences = {
  fontSize: 'medium',
  notifications: {
    breakingNews: true,
    newEpisodes: true,
    recommendations: false,
  },
  autoPlay: false,
  downloadQuality: 'medium',
};