import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import PodcastCard from '@/components/PodcastCard';
import { mockArticles } from '@/mocks/articles';
import { mockPodcasts } from '@/mocks/podcasts';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { typography, spacing } from '@/constants/typography';

export default function FrontPageScreen() {
  const { colors } = useTheme();
  const { currentTrack, isMiniPlayerDismissed } = useAudioPlayer();
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  
  const tabBarHeight = 60 + Math.max(insets.bottom, 0);
  const miniPlayerHeight = (currentTrack && !isMiniPlayerDismissed) ? 70 : 0;
  const bottomPadding = tabBarHeight + miniPlayerHeight;

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handlePodcastPress = (podcastId: string) => {
    router.push(`/podcast/${podcastId}`);
  };

  const { playTrack } = useAudioPlayer();

  const handlePlayPress = async (articleId: string) => {
    const article = mockArticles.find(a => a.id === articleId);
    if (article && article.audioUrl) {
      try {
        await playTrack({
          id: article.id,
          title: article.title,
          audioUrl: article.audioUrl,
          type: 'article',
          coverImage: article.coverImage,
          category: article.category,
        });
        console.log('Playing article:', article.title);
      } catch (error) {
        console.error('Error playing article:', error);
      }
    }
  };

  const handlePodcastPlayPress = async (podcastId: string) => {
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



  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header onSearchPress={handleSearchPress} onProfilePress={handleProfilePress} />
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Seneste</Text>
          {mockArticles.slice(0, 2).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              size="medium"
              onPress={() => handleArticlePress(article.id)}
              onPlayPress={article.audioUrl ? () => handlePlayPress(article.id) : undefined}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Andre brugere kunne lide</Text>
          {mockArticles.slice(2, 4).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              size="small"
              onPress={() => handleArticlePress(article.id)}
              onPlayPress={article.audioUrl ? () => handlePlayPress(article.id) : undefined}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Du finder måske dette interessant</Text>
          <View style={styles.podcastGrid}>
            {mockPodcasts.slice(0, 2).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                size="grid"
                onPress={() => handlePodcastPress(podcast.id)}
                onPlayPress={podcast.audioUrl ? () => handlePodcastPlayPress(podcast.id) : undefined}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.serif,
    marginBottom: spacing.lg,
  },
  podcastGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});