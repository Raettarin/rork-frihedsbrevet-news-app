import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Pause, Download, Share as ShareIcon, Bookmark, BookmarkCheck, Clock } from 'lucide-react-native';
import { mockPodcasts } from '@/mocks/podcasts';
import { PodcastEpisode } from '@/types/content';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useTheme } from '@/contexts/ThemeContext';
import MiniPlayer from '@/components/MiniPlayer';
import FullPlayer from '@/components/FullPlayer';
import { typography, spacing, borderRadius } from '@/constants/typography';

export default function PodcastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const { isPodcastSaved, togglePodcastSave } = useSavedItems();
  const { playTrack, pauseTrack, resumeTrack, currentTrack, isPlaying } = useAudioPlayer();
  
  const miniPlayerHeight = currentTrack ? 70 : 0;
  const bottomPadding = miniPlayerHeight + spacing.lg;

  const podcast = mockPodcasts.find(p => p.id === id);

  if (!podcast) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Podcast ikke fundet</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.accent }]}>
            <Text style={[styles.backButtonText, { color: colors.background }]}>Gå tilbage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentEpisode = selectedEpisode || podcast.episodes[0];

  const handleEpisodePress = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
  };

  const handlePlayPress = async () => {
    try {
      if (currentTrack?.id === currentEpisode.id) {
        // Same track - toggle play/pause
        if (isPlaying) {
          await pauseTrack();
        } else {
          await resumeTrack();
        }
      } else {
        // New track - start playing
        await playTrack({
          id: currentEpisode.id,
          title: currentEpisode.title,
          audioUrl: currentEpisode.audioUrl,
          type: 'podcast',
          coverImage: podcast?.coverImage,
        });
      }
      console.log('Toggle podcast playback:', currentEpisode.id);
    } catch (error) {
      console.error('Error playing podcast episode:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${podcast.title} - Lyt på Frihedsbrevet`,
        url: `https://frihedsbrevet.dk/podcast/${podcast.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async () => {
    if (podcast) {
      try {
        await togglePodcastSave(podcast);
        console.log('Toggle save podcast:', podcast.id);
      } catch (error) {
        console.error('Error toggling podcast save:', error);
      }
    }
  };

  const isSaved = podcast ? isPodcastSaved(podcast.id) : false;

  const handleDownload = () => {
    console.log('Download episode:', currentEpisode.id);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}t ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <ShareIcon color={colors.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            {isSaved ? (
              <BookmarkCheck color={colors.accent} size={20} />
            ) : (
              <Bookmark color={colors.text} size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={[styles.scrollContentContainer, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Podcast Header */}
        <View style={styles.podcastHeader}>
          <Image source={{ uri: podcast.coverImage }} style={styles.coverImage} />
          
          <View style={styles.podcastInfo}>
            <View style={[styles.categoryContainer, { backgroundColor: colors.accent }]}>
              <Text style={[styles.category, { color: colors.background }]}>{podcast.category}</Text>
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>{podcast.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{podcast.description}</Text>
            
            <View style={styles.podcastStats}>
              <Text style={[styles.statsText, { color: colors.textSecondary }]}>{podcast.totalSeasons} sæsoner</Text>
              <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.statsText, { color: colors.textSecondary }]}>{podcast.totalEpisodes} episoder</Text>
            </View>
          </View>
        </View>

        {/* Selected Episode */}
        {currentEpisode && (
          <View style={[styles.selectedEpisode, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Valgt episode</Text>
            
            <View style={[styles.episodeCard, { backgroundColor: colors.card }]}>
              <View style={styles.episodeInfo}>
                <Text style={[styles.episodeTitle, { color: colors.text }]}>{currentEpisode.title}</Text>
                <Text style={[styles.episodeDescription, { color: colors.textSecondary }]}>{currentEpisode.description}</Text>
                
                <View style={styles.episodeMeta}>
                  {currentEpisode.seasonNumber && currentEpisode.episodeNumber && (
                    <>
                      <Text style={[styles.episodeNumber, { color: colors.accent }]}>
                        S{currentEpisode.seasonNumber}E{currentEpisode.episodeNumber}
                      </Text>
                      <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
                    </>
                  )}
                  <Text style={[styles.episodeDate, { color: colors.textSecondary }]}>{formatDate(currentEpisode.publishedAt)}</Text>
                  <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
                  <View style={styles.durationContainer}>
                    <Clock color={colors.textSecondary} size={12} />
                    <Text style={[styles.episodeDuration, { color: colors.textSecondary }]}>{formatDuration(currentEpisode.duration)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.episodeActions}>
                <TouchableOpacity onPress={handlePlayPress} style={[styles.playButton, { backgroundColor: colors.accent }]}>
                  {(currentTrack?.id === currentEpisode.id && isPlaying) ? (
                    <Pause color={colors.background} size={24} />
                  ) : (
                    <Play color={colors.background} size={24} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                  <Download color={colors.text} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Episodes List */}
        <View style={styles.episodesList}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Alle episoder</Text>
          
          {podcast.episodes
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .map((episode) => (
              <TouchableOpacity
                key={episode.id}
                style={[
                  styles.episodeItem,
                  currentEpisode.id === episode.id && [styles.selectedEpisodeItem, { backgroundColor: colors.card }]
                ]}
                onPress={() => handleEpisodePress(episode)}
              >
                <View style={styles.episodeItemInfo}>
                  <Text style={[styles.episodeItemTitle, { color: colors.text }]}>{episode.title}</Text>
                  <Text style={[styles.episodeItemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {episode.description}
                  </Text>
                  
                  <View style={styles.episodeItemMeta}>
                    {episode.seasonNumber && episode.episodeNumber && (
                      <>
                        <Text style={[styles.episodeItemNumber, { color: colors.accent }]}>
                          S{episode.seasonNumber}E{episode.episodeNumber}
                        </Text>
                        <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
                      </>
                    )}
                    <Text style={[styles.episodeItemDate, { color: colors.textSecondary }]}>{formatDate(episode.publishedAt)}</Text>
                    <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
                    <View style={styles.durationContainer}>
                      <Clock color={colors.textSecondary} size={12} />
                      <Text style={[styles.episodeItemDuration, { color: colors.textSecondary }]}>{formatDuration(episode.duration)}</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.episodePlayButton}
                  onPress={async () => {
                    setSelectedEpisode(episode);
                    try {
                      await playTrack({
                        id: episode.id,
                        title: episode.title,
                        audioUrl: episode.audioUrl,
                        type: 'podcast',
                        coverImage: podcast?.coverImage,
                      });
                    } catch (error) {
                      console.error('Error playing episode:', error);
                    }
                  }}
                >
                  <Play color={colors.accent} size={20} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      
      {/* Mini Player positioned above bottom */}
      {currentTrack && (
        <View style={[styles.miniPlayerContainer, { bottom: Math.max(insets.bottom, 0) }]}>
          <MiniPlayer />
        </View>
      )}
      
      <FullPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scrollContent: {
    flex: 1,
  },
  podcastHeader: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  podcastInfo: {
    alignItems: 'center',
    width: '100%',
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  category: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: typography.fonts.serif,
  },
  description: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.serif,
  },
  podcastStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.serif,
  },
  separator: {
    fontSize: typography.sizes.base,
    marginHorizontal: spacing.sm,
  },
  selectedEpisode: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.serif,
  },
  episodeCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    fontFamily: typography.fonts.serif,
  },
  episodeDescription: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing.md,
    fontFamily: typography.fonts.serif,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  episodeNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  episodeDate: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.serif,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  episodeDuration: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.serif,
  },
  episodeActions: {
    alignItems: 'center',
    gap: spacing.md,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    padding: spacing.sm,
  },
  episodesList: {
    padding: spacing.lg,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.lg,
  },
  selectedEpisodeItem: {
    // backgroundColor will be set dynamically
  },
  episodeItemInfo: {
    flex: 1,
  },
  episodeItemTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
    fontFamily: typography.fonts.serif,
  },
  episodeItemDescription: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.normal,
    marginBottom: spacing.sm,
    fontFamily: typography.fonts.serif,
  },
  episodeItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  episodeItemNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  episodeItemDate: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.serif,
  },
  episodeItemDuration: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.serif,
  },
  episodePlayButton: {
    padding: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: typography.sizes.xl,
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.serif,
  },
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  miniPlayerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});