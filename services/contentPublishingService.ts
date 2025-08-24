// ADMIN/BACKEND ONLY - This service is reserved for backend plugin integrations
// Users cannot access publishing functionality from the app
import { WordPressService } from './wordPressService';
import { OmnyStudioService } from './omnyStudioService';
import { ContentPublishRequest, PublishResult, WordPressConfig, OmnyStudioConfig } from '@/types/integrations';

export class ContentPublishingService {
  private wordPressService?: WordPressService;
  private omnyStudioService?: OmnyStudioService;

  constructor(
    wordPressConfig?: WordPressConfig,
    omnyStudioConfig?: OmnyStudioConfig
  ) {
    if (wordPressConfig) {
      this.wordPressService = new WordPressService(wordPressConfig);
    }
    if (omnyStudioConfig) {
      this.omnyStudioService = new OmnyStudioService(omnyStudioConfig);
    }
  }

  async testConnections(): Promise<{ wordpress: boolean; omnyStudio: boolean }> {
    const results = {
      wordpress: false,
      omnyStudio: false,
    };

    if (this.wordPressService) {
      results.wordpress = await this.wordPressService.testConnection();
    }

    if (this.omnyStudioService) {
      results.omnyStudio = await this.omnyStudioService.testConnection();
    }

    return results;
  }

  async publishContent(request: ContentPublishRequest): Promise<PublishResult> {
    const result: PublishResult = {
      success: false,
      errors: [],
    };

    try {
      // Handle WordPress publishing
      if (request.publishToWordPress && this.wordPressService) {
        const wordPressResult = await this.publishToWordPress(request);
        if (wordPressResult.success) {
          result.wordPressId = wordPressResult.postId;
        } else {
          result.errors?.push(...(wordPressResult.errors || []));
        }
      }

      // Handle OmnyStudio publishing
      if (request.publishToOmnyStudio && this.omnyStudioService && request.audioFile) {
        const omnyStudioResult = await this.publishToOmnyStudio(request);
        if (omnyStudioResult.success) {
          result.omnyStudioId = omnyStudioResult.clipId;
        } else {
          result.errors?.push(...(omnyStudioResult.errors || []));
        }
      }

      // Update WordPress post with OmnyStudio audio URL if both were successful
      if (result.wordPressId && result.omnyStudioId && this.wordPressService && this.omnyStudioService) {
        await this.linkAudioToWordPressPost(result.wordPressId, result.omnyStudioId, request);
      }

      result.success = (result.wordPressId !== undefined || result.omnyStudioId !== undefined) && 
                      (result.errors?.length || 0) === 0;

    } catch (error) {
      console.error('Content publishing failed:', error);
      result.errors?.push(`Publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private async publishToWordPress(request: ContentPublishRequest): Promise<{ success: boolean; postId?: number; errors?: string[] }> {
    if (!this.wordPressService) {
      return { success: false, errors: ['WordPress service not configured'] };
    }

    try {
      const errors: string[] = [];
      let featuredMediaId: number | undefined;

      // Upload cover image if provided
      if (request.coverImage) {
        const media = await this.wordPressService.uploadMedia(request.coverImage);
        if (media) {
          featuredMediaId = media.id;
        } else {
          errors.push('Failed to upload cover image to WordPress');
        }
      }

      // Get or create category
      const categories = await this.wordPressService.getCategories();
      let categoryId = categories.find(cat => cat.name === request.category)?.id;
      
      if (!categoryId) {
        const newCategoryId = await this.wordPressService.createCategory(request.category);
        if (newCategoryId) {
          categoryId = newCategoryId;
        } else {
          errors.push('Failed to create category in WordPress');
        }
      }

      // Create the post
      const post = {
        title: { raw: request.title },
        content: { raw: request.content || request.description || '' },
        excerpt: { raw: request.description || '' },
        status: 'draft' as const,
        featured_media: featuredMediaId,
        categories: categoryId ? [categoryId] : undefined,
        meta: {
          journalist: request.journalist,
          read_time: request.content ? Math.ceil(request.content.length / 200) : undefined,
        },
      };

      const postId = await this.wordPressService.createPost(post);
      
      if (postId) {
        return { success: true, postId, errors: errors.length > 0 ? errors : undefined };
      } else {
        errors.push('Failed to create WordPress post');
        return { success: false, errors };
      }

    } catch (error) {
      console.error('WordPress publishing failed:', error);
      return { 
        success: false, 
        errors: [`WordPress publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }

  private async publishToOmnyStudio(request: ContentPublishRequest): Promise<{ success: boolean; clipId?: string; errors?: string[] }> {
    if (!this.omnyStudioService || !request.audioFile) {
      return { success: false, errors: ['OmnyStudio service not configured or no audio file provided'] };
    }

    try {
      const errors: string[] = [];

      // Get existing programs
      const programs = await this.omnyStudioService.getPrograms();
      let programId = programs.find(p => p.Name === request.category)?.Id;

      // Create program if it doesn't exist
      if (!programId) {
        const newProgramId = await this.omnyStudioService.createProgram(
          request.category,
          `Program for ${request.category} content`,
          request.coverImage?.uri
        );
        
        if (newProgramId) {
          programId = newProgramId;
        } else {
          errors.push('Failed to create program in OmnyStudio');
          return { success: false, errors };
        }
      }

      // Upload audio
      const uploadResult = await this.omnyStudioService.uploadAudio(
        programId,
        request.audioFile,
        request.title,
        request.description
      );

      if (uploadResult) {
        // Publish the clip
        const publishSuccess = await this.omnyStudioService.publishClip(programId, uploadResult.Id);
        if (!publishSuccess) {
          errors.push('Failed to publish clip in OmnyStudio');
        }

        return { 
          success: true, 
          clipId: uploadResult.Id, 
          errors: errors.length > 0 ? errors : undefined 
        };
      } else {
        errors.push('Failed to upload audio to OmnyStudio');
        return { success: false, errors };
      }

    } catch (error) {
      console.error('OmnyStudio publishing failed:', error);
      return { 
        success: false, 
        errors: [`OmnyStudio publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }

  private async linkAudioToWordPressPost(
    wordPressId: number, 
    omnyStudioId: string, 
    request: ContentPublishRequest
  ): Promise<void> {
    if (!this.wordPressService || !this.omnyStudioService) return;

    try {
      // Get the clip details from OmnyStudio to get the audio URL
      const programs = await this.omnyStudioService.getPrograms();
      const programId = programs.find(p => p.Name === request.category)?.Id;
      
      if (programId) {
        const clip = await this.omnyStudioService.getClip(programId, omnyStudioId);
        if (clip && clip.AudioUrl) {
          // Update WordPress post with audio URL
          await this.wordPressService.updatePost(wordPressId, {
            meta: {
              audio_url: clip.AudioUrl,
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to link audio to WordPress post:', error);
    }
  }
}