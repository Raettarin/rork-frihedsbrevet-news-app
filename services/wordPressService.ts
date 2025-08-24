// ADMIN/BACKEND ONLY - This service is reserved for backend plugin integrations
// Users cannot access WordPress publishing functionality from the app
import { WordPressConfig, WordPressPost, WordPressMedia } from '@/types/integrations';

export class WordPressService {
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
  }

  private getAuthHeaders(): HeadersInit {
    const credentials = btoa(`${this.config.username}:${this.config.applicationPassword}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  private getMediaAuthHeaders(): HeadersInit {
    const credentials = btoa(`${this.config.username}:${this.config.applicationPassword}`);
    return {
      'Authorization': `Basic ${credentials}`,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/users/me`, {
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  }

  async uploadMedia(file: { uri: string; name: string; type: string }): Promise<WordPressMedia | null> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: this.getMediaAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Media upload failed: ${response.statusText}`);
      }

      const media = await response.json();
      return {
        id: media.id,
        source_url: media.source_url,
        alt_text: media.alt_text,
        media_type: media.media_type,
      };
    } catch (error) {
      console.error('WordPress media upload failed:', error);
      return null;
    }
  }

  async createPost(post: WordPressPost): Promise<number | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error(`Post creation failed: ${response.statusText}`);
      }

      const createdPost = await response.json();
      return createdPost.id;
    } catch (error) {
      console.error('WordPress post creation failed:', error);
      return null;
    }
  }

  async updatePost(postId: number, post: Partial<WordPressPost>): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(post),
      });

      return response.ok;
    } catch (error) {
      console.error('WordPress post update failed:', error);
      return false;
    }
  }

  async getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/categories`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Categories fetch failed: ${response.statusText}`);
      }

      const categories = await response.json();
      return categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      }));
    } catch (error) {
      console.error('WordPress categories fetch failed:', error);
      return [];
    }
  }

  async createCategory(name: string, slug?: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/wp-json/wp/v2/categories`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (!response.ok) {
        throw new Error(`Category creation failed: ${response.statusText}`);
      }

      const category = await response.json();
      return category.id;
    } catch (error) {
      console.error('WordPress category creation failed:', error);
      return null;
    }
  }
}