import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import { mockArticles } from '@/mocks/articles';
import { articleCategories } from '@/constants/categories';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import Colors from '@/constants/colors';

export default function ArticlesScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleShowAll = () => {
    setSelectedCategories([]);
  };

  const filteredArticles = selectedCategories.length === 0 
    ? mockArticles 
    : mockArticles.filter(article => selectedCategories.includes(article.category));

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
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

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onSearchPress={() => router.push('/search')} 
        onProfilePress={() => console.log('Profile pressed')} 
      />
      
      <CategoryFilter
        categories={articleCategories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onShowAll={handleShowAll}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.articlesContainer}>
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              size={index < 2 ? 'medium' : 'small'}
              onPress={() => handleArticlePress(article.id)}
              onPlayPress={article.audioUrl ? () => handlePlayPress(article.id) : undefined}
            />
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
  content: {
    flex: 1,
  },
  articlesContainer: {
    padding: 16,
  },
});