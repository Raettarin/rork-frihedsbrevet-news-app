// ADMIN/BACKEND ONLY - These types are reserved for backend plugin integrations
// Users cannot access publishing functionality from the app

// WordPress Integration Types
export interface WordPressConfig {
  baseUrl: string;
  username: string;
  applicationPassword: string;
}

export interface WordPressPost {
  id?: number;
  title: {
    rendered?: string;
    raw?: string;
  };
  content: {
    rendered?: string;
    raw?: string;
  };
  excerpt: {
    rendered?: string;
    raw?: string;
  };
  status: 'draft' | 'publish' | 'private';
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  meta?: {
    journalist?: string;
    read_time?: number;
    audio_url?: string;
  };
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_type: string;
}

export interface OmnyStudioConfig {
  orgId: string;
  apiKey: string;
  baseUrl: string;
}

export interface OmnyStudioProgram {
  Id: string;
  Name: string;
  ArtworkUrl: string;
  Description: string;
}

export interface OmnyStudioClip {
  Id: string;
  Title: string;
  Description: string;
  AudioUrl: string;
  Duration: number;
  PublishedUtc: string;
  ProgramId: string;
  ImageUrl?: string;
}

export interface OmnyStudioUploadResponse {
  Id: string;
  Title: string;
  AudioUrl: string;
  Duration: number;
  Status: 'Processing' | 'Published' | 'Failed';
}

export interface ContentPublishRequest {
  type: 'article' | 'podcast';
  title: string;
  content?: string;
  description?: string;
  category: string;
  journalist?: string;
  audioFile?: {
    uri: string;
    name: string;
    type: string;
  };
  coverImage?: {
    uri: string;
    name: string;
    type: string;
  };
  publishToWordPress: boolean;
  publishToOmnyStudio: boolean;
}

export interface PublishResult {
  success: boolean;
  wordPressId?: number;
  omnyStudioId?: string;
  errors?: string[];
}