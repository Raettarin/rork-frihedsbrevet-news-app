import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import CustomSlider from './CustomSlider';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function FullPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    position, 
    duration, 
    pauseTrack, 
    resumeTrack, 
    seekTo,
    closeFullPlayer,
    isFullPlayerOpen 
  } = useAudioPlayer();

  if (!currentTrack) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else {
      await resumeTrack();
    }
  };

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={isFullPlayerOpen}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeFullPlayer} style={styles.closeButton}>
            <X color={Colors.light.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nu afspilles</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Cover Art */}
        <View style={styles.coverContainer}>
          {currentTrack.coverImage ? (
            <Image source={{ uri: currentTrack.coverImage }} style={styles.coverImage} />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderText}>
                {currentTrack.type === 'article' ? '📰' : '🎧'}
              </Text>
            </View>
          )}
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <TouchableOpacity 
            onPress={() => {
              closeFullPlayer();
              if (currentTrack.type === 'article') {
                router.push(`/article/${currentTrack.id}`);
              } else {
                router.push(`/podcast/${currentTrack.id}`);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.title} numberOfLines={2}>
              {currentTrack.title}
            </Text>
          </TouchableOpacity>
          
          {currentTrack.category && (
            <TouchableOpacity 
              onPress={() => {
                closeFullPlayer();
                if (currentTrack.type === 'article') {
                  router.push('/articles');
                } else {
                  router.push('/podcasts');
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.subtitle}>
                {currentTrack.category}
              </Text>
            </TouchableOpacity>
          )}
          
          {!currentTrack.category && (
            <Text style={styles.subtitle}>
              {currentTrack.type === 'article' ? 'Artikel' : 'Podcast'}
            </Text>
          )}
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <CustomSlider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={Colors.light.accent}
            maximumTrackTintColor={Colors.light.border}
            thumbTintColor={Colors.light.accent}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} disabled>
            <SkipBack color={Colors.light.tabIconDefault} size={32} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingIndicator} />
            ) : isPlaying ? (
              <Pause color={Colors.light.background} size={32} />
            ) : (
              <Play color={Colors.light.background} size={32} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} disabled>
            <SkipForward color={Colors.light.tabIconDefault} size={32} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Georgia',
  },
  placeholder: {
    width: 40,
  },
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  coverImage: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    maxHeight: 300,
    borderRadius: 12,
  },
  placeholderCover: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  trackInfo: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  progressContainer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 40,
  },
  controlButton: {
    padding: 16,
  },
  playButton: {
    backgroundColor: Colors.light.accent,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.light.background,
    borderTopColor: 'transparent',
  },
});