import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Pause, Download, Share as ShareIcon, Bookmark, BookmarkCheck, Clock } from 'lucide-react-native';
import { mockPodcasts } from '@/mocks/podcasts';
import { PodcastEpisode } from '@/types/content';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import Colors from '@/constants/colors';

export default function PodcastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const { isPodcastSaved, togglePodcastSave } = useSavedItems();
  const { playTrack, pauseTrack, currentTrack, isPlaying } = useAudioPlayer();

  const podcast = mockPodcasts.find(p => p.id === id);

  if (!podcast) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Podcast ikke fundet</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Gå tilbage</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentEpisode = selectedEpisode || podcast.episodes[0];

  const handleEpisodePress = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
  };

  const handlePlayPress = async (episode?: PodcastEpisode) => {
    const episodeToPlay = episode || currentEpisode;
    const isCurrentTrack = currentTrack?.id === episodeToPlay.id;
    
    if (isCurrentTrack && isPlaying) {
      await pauseTrack();
    } else if (isCurrentTrack && !isPlaying) {
      // Resume current track - this will be handled by the mini player
      console.log('Use mini player to resume');
    } else {
      // Play new track
      await playTrack({
        id: episodeToPlay.id,
        title: episodeToPlay.title,
        audioUrl: episodeToPlay.audioUrl,
        type: 'podcast',
        coverImage: podcast.coverImage,
        duration: episodeToPlay.duration * 1000, // Convert to milliseconds
      });
      
      if (episode) {
        setSelectedEpisode(episode);
      }
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft color={Colors.light.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <ShareIcon color={Colors.light.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            {isSaved ? (
              <BookmarkCheck color={Colors.light.accent} size={20} />
            ) : (
              <Bookmark color={Colors.light.text} size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Podcast Header */}
        <View style={styles.podcastHeader}>
          <Image source={{ uri: podcast.coverImage }} style={styles.coverImage} />
          
          <View style={styles.podcastInfo}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{podcast.category}</Text>
            </View>
            
            <Text style={styles.title}>{podcast.title}</Text>
            <Text style={styles.description}>{podcast.description}</Text>
            
            <View style={styles.podcastStats}>
              <Text style={styles.statsText}>{podcast.totalSeasons} sæsoner</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.statsText}>{podcast.totalEpisodes} episoder</Text>
            </View>
          </View>
        </View>

        {/* Selected Episode */}
        {currentEpisode && (
          <View style={styles.selectedEpisode}>
            <Text style={styles.sectionTitle}>Valgt episode</Text>
            
            <View style={styles.episodeCard}>
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle}>{currentEpisode.title}</Text>
                <Text style={styles.episodeDescription}>{currentEpisode.description}</Text>
                
                <View style={styles.episodeMeta}>
                  {currentEpisode.seasonNumber && currentEpisode.episodeNumber && (
                    <>
                      <Text style={styles.episodeNumber}>
                        S{currentEpisode.seasonNumber}E{currentEpisode.episodeNumber}
                      </Text>
                      <Text style={styles.separator}>•</Text>
                    </>
                  )}
                  <Text style={styles.episodeDate}>{formatDate(currentEpisode.publishedAt)}</Text>
                  <Text style={styles.separator}>•</Text>
                  <View style={styles.durationContainer}>
                    <Clock color={Colors.light.tabIconDefault} size={12} />
                    <Text style={styles.episodeDuration}>{formatDuration(currentEpisode.duration)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.episodeActions}>
                <TouchableOpacity onPress={() => handlePlayPress()} style={styles.playButton}>
                  {currentTrack?.id === currentEpisode.id && isPlaying ? (
                    <Pause color={Colors.light.background} size={24} />
                  ) : (
                    <Play color={Colors.light.background} size={24} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                  <Download color={Colors.light.text} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Episodes List */}
        <View style={styles.episodesList}>
          <Text style={styles.sectionTitle}>Alle episoder</Text>
          
          {podcast.episodes
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .map((episode) => (
              <TouchableOpacity
                key={episode.id}
                style={[
                  styles.episodeItem,
                  currentEpisode.id === episode.id && styles.selectedEpisodeItem
                ]}
                onPress={() => handleEpisodePress(episode)}
              >
                <View style={styles.episodeItemInfo}>
                  <Text style={styles.episodeItemTitle}>{episode.title}</Text>
                  <Text style={styles.episodeItemDescription} numberOfLines={2}>
                    {episode.description}
                  </Text>
                  
                  <View style={styles.episodeItemMeta}>
                    {episode.seasonNumber && episode.episodeNumber && (
                      <>
                        <Text style={styles.episodeItemNumber}>
                          S{episode.seasonNumber}E{episode.episodeNumber}
                        </Text>
                        <Text style={styles.separator}>•</Text>
                      </>
                    )}
                    <Text style={styles.episodeItemDate}>{formatDate(episode.publishedAt)}</Text>
                    <Text style={styles.separator}>•</Text>
                    <View style={styles.durationContainer}>
                      <Clock color={Colors.light.tabIconDefault} size={12} />
                      <Text style={styles.episodeItemDuration}>{formatDuration(episode.duration)}</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.episodePlayButton}
                  onPress={() => handlePlayPress(episode)}
                >
                  {currentTrack?.id === episode.id && isPlaying ? (
                    <Pause color={Colors.light.accent} size={20} />
                  ) : (
                    <Play color={Colors.light.accent} size={20} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    flex: 1,
  },
  podcastHeader: {
    padding: 20,
    alignItems: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  podcastInfo: {
    alignItems: 'center',
    width: '100%',
  },
  categoryContainer: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  category: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  description: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  podcastStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  separator: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginHorizontal: 8,
  },
  selectedEpisode: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  episodeCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  episodeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  episodeNumber: {
    fontSize: 12,
    color: Colors.light.accent,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  episodeDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  episodeDuration: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  episodeActions: {
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: Colors.light.accent,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    padding: 8,
  },
  episodesList: {
    padding: 20,
    paddingBottom: 100, // Extra padding for mini player
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 16,
  },
  selectedEpisodeItem: {
    backgroundColor: Colors.light.card,
  },
  episodeItemInfo: {
    flex: 1,
  },
  episodeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
    fontFamily: 'Georgia',
  },
  episodeItemDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  episodeItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  episodeItemNumber: {
    fontSize: 12,
    color: Colors.light.accent,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  episodeItemDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  episodeItemDuration: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  episodePlayButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
    fontFamily: 'Georgia',
  },
  backButton: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
});