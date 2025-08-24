import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Play, Pause, X } from 'lucide-react-native';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, shadows, spacing, borderRadius } from '@/constants/typography';

export default function MiniPlayer() {
  const { colors } = useTheme();
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    position, 
    duration, 
    pauseTrack, 
    resumeTrack, 
    openFullPlayer,
    dismissMiniPlayer,
    isMiniPlayerDismissed
  } = useAudioPlayer();

  if (!currentTrack || isMiniPlayerDismissed) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else {
      await resumeTrack();
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]} 
      onPress={openFullPlayer}
      activeOpacity={0.8}
    >
      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
        <View style={[styles.progressBar, { backgroundColor: colors.accent, width: `${progressPercentage}%` }]} />
      </View>

      {/* Mini Player Content */}
      <View style={styles.content}>
        {/* Track Info */}
        <View style={styles.trackInfo}>
          {currentTrack.coverImage && (
            <Image source={{ uri: currentTrack.coverImage }} style={styles.coverImage} />
          )}
          <View style={styles.textInfo}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {currentTrack.type === 'article' ? 'Artikel' : 'Podcast'} • {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: colors.accent }]} 
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={[styles.loadingIndicator, { borderColor: colors.background }]} />
            ) : isPlaying ? (
              <Pause color={colors.background} size={20} />
            ) : (
              <Play color={colors.background} size={20} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={dismissMiniPlayer}
          >
            <X color={colors.textSecondary} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    ...shadows.large,
  },
  progressContainer: {
    height: 2,
  },
  progressBar: {
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  coverImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm + 2,
    marginRight: spacing.md,
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderTopColor: 'transparent',
  },
});