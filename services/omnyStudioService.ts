// ADMIN/BACKEND ONLY - This service is reserved for backend plugin integrations
// Users cannot access OmnyStudio publishing functionality from the app
import { OmnyStudioConfig, OmnyStudioProgram, OmnyStudioClip, OmnyStudioUploadResponse } from '@/types/integrations';

export class OmnyStudioService {
  private config: OmnyStudioConfig;

  constructor(config: OmnyStudioConfig) {
    this.config = config;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private getUploadAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/orgs/${this.config.orgId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('OmnyStudio connection test failed:', error);
      return false;
    }
  }

  async getPrograms(): Promise<OmnyStudioProgram[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/orgs/${this.config.orgId}/programs`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Programs fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.Programs || [];
    } catch (error) {
      console.error('OmnyStudio programs fetch failed:', error);
      return [];
    }
  }

  async createProgram(name: string, description: string, artworkUrl?: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/orgs/${this.config.orgId}/programs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          Name: name,
          Description: description,
          ArtworkUrl: artworkUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Program creation failed: ${response.statusText}`);
      }

      const program = await response.json();
      return program.Id;
    } catch (error) {
      console.error('OmnyStudio program creation failed:', error);
      return null;
    }
  }

  async uploadAudio(
    programId: string,
    audioFile: { uri: string; name: string; type: string },
    title: string,
    description?: string
  ): Promise<OmnyStudioUploadResponse | null> {
    try {
      // First, get upload URL
      const uploadUrlResponse = await fetch(
        `${this.config.baseUrl}/orgs/${this.config.orgId}/programs/${programId}/clips/upload-url`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            Title: title,
            Description: description || '',
            FileName: audioFile.name,
          }),
        }
      );

      if (!uploadUrlResponse.ok) {
        throw new Error(`Upload URL request failed: ${uploadUrlResponse.statusText}`);
      }

      const uploadData = await uploadUrlResponse.json();
      const { UploadUrl, ClipId } = uploadData;

      // Upload the audio file
      const formData = new FormData();
      formData.append('file', {
        uri: audioFile.uri,
        name: audioFile.name,
        type: audioFile.type,
      } as any);

      const uploadResponse = await fetch(UploadUrl, {
        method: 'PUT',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Audio upload failed: ${uploadResponse.statusText}`);
      }

      // Confirm upload completion
      const confirmResponse = await fetch(
        `${this.config.baseUrl}/orgs/${this.config.orgId}/programs/${programId}/clips/${ClipId}/upload-complete`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );

      if (!confirmResponse.ok) {
        throw new Error(`Upload confirmation failed: ${confirmResponse.statusText}`);
      }

      const result = await confirmResponse.json();
      return {
        Id: ClipId,
        Title: title,
        AudioUrl: result.AudioUrl || '',
        Duration: result.Duration || 0,
        Status: 'Processing',
      };
    } catch (error) {
      console.error('OmnyStudio audio upload failed:', error);
      return null;
    }
  }

  async getClip(programId: string, clipId: string): Promise<OmnyStudioClip | null> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/orgs/${this.config.orgId}/programs/${programId}/clips/${clipId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Clip fetch failed: ${response.statusText}`);
      }

      const clip = await response.json();
      return {
        Id: clip.Id,
        Title: clip.Title,
        Description: clip.Description,
        AudioUrl: clip.AudioUrl,
        Duration: clip.Duration,
        PublishedUtc: clip.PublishedUtc,
        ProgramId: clip.ProgramId,
        ImageUrl: clip.ImageUrl,
      };
    } catch (error) {
      console.error('OmnyStudio clip fetch failed:', error);
      return null;
    }
  }

  async publishClip(programId: string, clipId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/orgs/${this.config.orgId}/programs/${programId}/clips/${clipId}/publish`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('OmnyStudio clip publish failed:', error);
      return false;
    }
  }

  async updateClip(
    programId: string,
    clipId: string,
    updates: { title?: string; description?: string; imageUrl?: string }
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/orgs/${this.config.orgId}/programs/${programId}/clips/${clipId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            Title: updates.title,
            Description: updates.description,
            ImageUrl: updates.imageUrl,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('OmnyStudio clip update failed:', error);
      return false;
    }
  }
}