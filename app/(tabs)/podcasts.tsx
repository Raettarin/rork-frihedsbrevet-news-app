import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import PodcastCard from '@/components/PodcastCard';
import { mockPodcasts } from '@/mocks/podcasts';
import { podcastCategories } from '@/constants/categories';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import Colors from '@/constants/colors';

export default function PodcastsScreen() {
  const { playTrack } = useAudioPlayer();

  const handlePodcastPress = (podcastId: string) => {
    router.push(`/podcast/${podcastId}`);
  };

  const handlePlayPress = async (podcastId: string) => {
    const podcast = mockPodcasts.find(p => p.id === podcastId);
    if (podcast && podcast.audioUrl) {
      try {
        await playTrack({
          id: podcast.id,
          title: podcast.title,
          audioUrl: podcast.audioUrl,
          type: 'podcast',
          coverImage: podcast.coverImage,
          category: podcast.category,
        });
        console.log('Playing podcast:', podcast.title);
      } catch (error) {
        console.error('Error playing podcast:', error);
      }
    }
  };

  const newestEpisodes = mockPodcasts.slice(0, 4);

  const getPodcastsByCategory = (category: string) => {
    return mockPodcasts.filter(podcast => podcast.category === category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onSearchPress={() => router.push('/search')} 
        onProfilePress={() => console.log('Profile pressed')} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nyeste episoder</Text>
          <View style={styles.podcastGrid}>
            {newestEpisodes.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                size="grid"
                onPress={() => handlePodcastPress(podcast.id)}
                onPlayPress={podcast.audioUrl ? () => handlePlayPress(podcast.id) : undefined}
              />
            ))}
          </View>
        </View>

        {podcastCategories.map((category) => {
          const categoryPodcasts = getPodcastsByCategory(category);
          if (categoryPodcasts.length === 0) return null;

          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              {categoryPodcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  size="list"
                  onPress={() => handlePodcastPress(podcast.id)}
                  onPlayPress={podcast.audioUrl ? () => handlePlayPress(podcast.id) : undefined}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  podcastGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});