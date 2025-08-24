import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import PodcastCard from '@/components/PodcastCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { Bookmark } from 'lucide-react-native';

type TabType = 'articles' | 'podcasts';

export default function SavedScreen() {
  const { colors } = useTheme();
  const { savedArticles, savedPodcasts, isLoading } = useSavedItems();
  const [activeTab, setActiveTab] = useState<TabType>('articles');

  const hasArticles = savedArticles.length > 0;
  const hasPodcasts = savedPodcasts.length > 0;
  const hasAnyContent = hasArticles || hasPodcasts;

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handlePodcastPress = (podcastId: string) => {
    router.push(`/podcast/${podcastId}`);
  };

  const renderTabButton = (tab: TabType, title: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? colors.accent : 'transparent',
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabText,
          {
            color: activeTab === tab ? colors.card : colors.text,
            fontWeight: activeTab === tab ? '600' : '400',
          },
        ]}
      >
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Bookmark size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {activeTab === 'articles' ? 'Ingen gemte artikler' : 'Ingen gemte podcasts'}
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {activeTab === 'articles'
          ? 'Artikler du gemmer vil blive vist her'
          : 'Podcasts du gemmer vil blive vist her'}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Indlæser...</Text>
        </View>
      );
    }

    if (!hasAnyContent) {
      return (
        <View style={styles.emptyState}>
          <Bookmark size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Ingen gemte elementer</Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Artikler og podcasts du gemmer vil blive vist her
          </Text>
        </View>
      );
    }

    if (activeTab === 'articles') {
      return hasArticles ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            {savedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                size="medium"
                onPress={() => handleArticlePress(article.id)}
                onPlayPress={() => console.log('Play article:', article.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        renderEmptyState()
      );
    }

    return hasPodcasts ? (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {savedPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              size="list"
              onPress={() => handlePodcastPress(podcast.id)}
            />
          ))}
        </View>
      </ScrollView>
    ) : (
      renderEmptyState()
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        onSearchPress={() => router.push('/search')} 
        onProfilePress={() => router.push('/profile')} 
      />
      
      {hasAnyContent && (
        <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          {renderTabButton('articles', 'Artikler', savedArticles.length)}
          {renderTabButton('podcasts', 'Podcasts', savedPodcasts.length)}
        </View>
      )}
      
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});