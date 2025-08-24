import { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseUrl = 'https://api.frihedsbrevet.dk'; // Mock API endpoint

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: User = {
      id: '1',
      name: 'Demo Bruger',
      email: credentials.email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      name: 'Google Bruger',
      email: 'google@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'google-jwt-token-' + Date.now(),
    };
  }

  async loginWithApple(): Promise<AuthResponse> {
    // Simulate Apple OAuth
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockUser: User = {
      id: '3',
      name: 'Apple Bruger',
      email: 'apple@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'apple-jwt-token-' + Date.now(),
    };
  }

  async refreshToken(token: string): Promise<string> {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'refreshed-jwt-token-' + Date.now();
  }

  async validateToken(token: string): Promise<boolean> {
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 300));
    return token.startsWith('mock-jwt-token') || 
           token.startsWith('google-jwt-token') || 
           token.startsWith('apple-jwt-token');
  }

  async logout(): Promise<void> {
    // Simulate logout API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async syncPreferences(preferences: any, token: string): Promise<void> {
    // Simulate syncing preferences to server
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Preferences synced to server:', preferences);
  }
}

export const authService = new AuthService();