import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { X, Filter, Search as SearchIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockArticles } from '@/mocks/articles';
import { mockPodcasts } from '@/mocks/podcasts';
import { mockSavedItems } from '@/mocks/savedItems';
import { articleCategories, podcastCategories } from '@/constants/categories';
import { Article, Podcast, PodcastEpisode } from '@/types/content';
import ArticleCard from '@/components/ArticleCard';
import PodcastCard from '@/components/PodcastCard';

type SearchResult = {
  type: 'article' | 'podcast' | 'episode';
  item: Article | Podcast | (PodcastEpisode & { podcastTitle: string });
};

type FilterType = 'all' | 'articles' | 'podcasts' | 'saved';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search articles
    if (selectedFilter === 'all' || selectedFilter === 'articles') {
      mockArticles.forEach(article => {
        const matchesQuery = 
          article.title.toLowerCase().includes(query) ||
          article.journalist.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query);

        const matchesCategory = 
          selectedCategories.length === 0 || 
          selectedCategories.includes(article.category);

        if (matchesQuery && matchesCategory) {
          results.push({ type: 'article', item: article });
        }
      });
    }

    // Search saved items
    if (selectedFilter === 'saved') {
      mockSavedItems.articles.forEach(article => {
        const matchesQuery = 
          article.title.toLowerCase().includes(query) ||
          article.journalist.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query);

        const matchesCategory = 
          selectedCategories.length === 0 || 
          selectedCategories.includes(article.category);

        if (matchesQuery && matchesCategory) {
          results.push({ type: 'article', item: article });
        }
      });

      mockSavedItems.podcasts.forEach(podcast => {
        const podcastMatchesQuery = 
          podcast.title.toLowerCase().includes(query) ||
          podcast.description.toLowerCase().includes(query) ||
          podcast.category.toLowerCase().includes(query);

        const podcastMatchesCategory = 
          selectedCategories.length === 0 || 
          selectedCategories.includes(podcast.category);

        if (podcastMatchesQuery && podcastMatchesCategory) {
          results.push({ type: 'podcast', item: podcast });
        }

        // Search episodes in saved podcasts
        podcast.episodes.forEach(episode => {
          const episodeMatchesQuery = 
            episode.title.toLowerCase().includes(query) ||
            episode.description.toLowerCase().includes(query);

          if (episodeMatchesQuery && podcastMatchesCategory) {
            results.push({
              type: 'episode',
              item: { ...episode, podcastTitle: podcast.title }
            });
          }
        });
      });
    }

    // Search podcasts and episodes
    if (selectedFilter === 'all' || selectedFilter === 'podcasts') {
      mockPodcasts.forEach(podcast => {
        const podcastMatchesQuery = 
          podcast.title.toLowerCase().includes(query) ||
          podcast.description.toLowerCase().includes(query) ||
          podcast.category.toLowerCase().includes(query);

        const podcastMatchesCategory = 
          selectedCategories.length === 0 || 
          selectedCategories.includes(podcast.category);

        if (podcastMatchesQuery && podcastMatchesCategory) {
          results.push({ type: 'podcast', item: podcast });
        }

        // Search episodes
        podcast.episodes.forEach(episode => {
          const episodeMatchesQuery = 
            episode.title.toLowerCase().includes(query) ||
            episode.description.toLowerCase().includes(query);

          if (episodeMatchesQuery && podcastMatchesCategory) {
            results.push({
              type: 'episode',
              item: { ...episode, podcastTitle: podcast.title }
            });
          }
        });
      });
    }

    return results;
  }, [searchQuery, selectedFilter, selectedCategories]);

  const availableCategories = useMemo(() => {
    if (selectedFilter === 'articles') return articleCategories;
    if (selectedFilter === 'podcasts') return podcastCategories;
    return [...articleCategories, ...podcastCategories];
  }, [selectedFilter]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'article') {
      return (
        <ArticleCard 
          article={item.item as Article} 
          onPress={() => router.push(`/article/${item.item.id}`)}
          onPlayPress={() => console.log('Play article:', item.item.id)}
        />
      );
    }
    
    if (item.type === 'podcast') {
      return (
        <PodcastCard 
          podcast={item.item as Podcast} 
          onPress={() => router.push(`/podcast/${item.item.id}`)}
        />
      );
    }

    // Episode result
    const episode = item.item as PodcastEpisode & { podcastTitle: string };
    return (
      <View style={styles.episodeCard}>
        <Text style={styles.episodeTitle}>{episode.title}</Text>
        <Text style={styles.episodePodcast}>From: {episode.podcastTitle}</Text>
        <Text style={styles.episodeDescription} numberOfLines={2}>
          {episode.description}
        </Text>
        <View style={styles.episodeMeta}>
          <Text style={styles.episodeMetaText}>
            S{episode.seasonNumber} E{episode.episodeNumber} • {Math.floor(episode.duration / 60)} min
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, podcasts..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['all', 'articles', 'podcasts', 'saved'] as FilterType[]).map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={styles.categoryFilterButton}
          onPress={() => setShowCategoryFilter(!showCategoryFilter)}
        >
          <Filter size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      {showCategoryFilter && (
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Categories</Text>
            <TouchableOpacity onPress={clearCategories}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categoryButtonActive
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategories.includes(category) && styles.categoryButtonTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.trim() === '' ? (
          <View style={styles.emptyState}>
            <SearchIcon size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyStateText}>Search for articles and podcasts</Text>
            <Text style={styles.emptyStateSubtext}>
              Find content by title, author, or category
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `${item.type}-${item.item.id}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          </>
        )}
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 12,
    fontFamily: 'Georgia',
  },
  closeButton: {
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterScroll: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.text,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.light.background,
  },
  categoryFilterButton: {
    padding: 8,
    marginLeft: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Georgia',
  },
  clearButton: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.text,
    borderColor: Colors.light.text,
  },
  categoryButtonText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: Colors.light.background,
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  episodeCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  episodePodcast: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  episodeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeMetaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});