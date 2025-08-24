import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Pause, Type, Share as ShareIcon, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { mockArticles } from '@/mocks/articles';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import Colors from '@/constants/colors';

export default function ArticlePostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fontSize, setFontSize] = useState<number>(16);
  const { isArticleSaved, toggleArticleSave } = useSavedItems();
  const { playTrack, pauseTrack, currentTrack, isPlaying } = useAudioPlayer();

  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Artikel ikke fundet</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Gå tilbage</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlayPress = async () => {
    if (article.audioUrl) {
      const isCurrentTrack = currentTrack?.id === article.id;
      
      if (isCurrentTrack && isPlaying) {
        await pauseTrack();
      } else if (isCurrentTrack && !isPlaying) {
        // Resume current track - this will be handled by the mini player
        console.log('Use mini player to resume');
      } else {
        // Play new track
        await playTrack({
          id: article.id,
          title: article.title,
          audioUrl: article.audioUrl,
          type: 'article',
          coverImage: article.coverImage,
        });
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title} - Læs mere på Frihedsbrevet`,
        url: `https://frihedsbrevet.dk/article/${article.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async () => {
    if (article) {
      try {
        await toggleArticleSave(article);
        console.log('Toggle save article:', article.id);
      } catch (error) {
        console.error('Error toggling article save:', error);
      }
    }
  };

  const isSaved = article ? isArticleSaved(article.id) : false;
  const isCurrentTrack = currentTrack?.id === article.id;

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
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
        {/* Cover Image */}
        <Image source={{ uri: article.coverImage }} style={styles.coverImage} />
        
        {/* Article Meta */}
        <View style={styles.articleMeta}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{article.category}</Text>
          </View>
          
          <Text style={styles.title}>{article.title}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.journalist}>Af {article.journalist}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.readTime}>{article.readTime} min. læsning</Text>
          </View>
        </View>

        {/* Audio Player & Font Controls */}
        <View style={styles.controls}>
          {article.audioUrl && (
            <TouchableOpacity onPress={handlePlayPress} style={styles.playButton}>
              {isCurrentTrack && isPlaying ? (
                <Pause color={Colors.light.background} size={20} />
              ) : (
                <Play color={Colors.light.background} size={20} />
              )}
              <Text style={styles.playButtonText}>
                {isCurrentTrack && isPlaying ? 'Pause' : 'Lyt til artikel'}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.fontControls}>
            <TouchableOpacity onPress={decreaseFontSize} style={styles.fontButton}>
              <Type color={Colors.light.text} size={16} />
              <Text style={styles.fontButtonText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={increaseFontSize} style={styles.fontButton}>
              <Type color={Colors.light.text} size={20} />
              <Text style={styles.fontButtonText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <Text style={[styles.excerpt, { fontSize: fontSize + 2 }]}>{article.excerpt}</Text>
          <Text style={[styles.contentText, { fontSize }]}>{article.content}</Text>
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
  coverImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  articleMeta: {
    padding: 20,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
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
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 36,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  journalist: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    fontFamily: 'Georgia',
  },
  separator: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginHorizontal: 8,
  },
  date: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  readTime: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Georgia',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  playButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  fontControls: {
    flexDirection: 'row',
    gap: 12,
  },
  fontButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  fontButtonText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  articleContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for mini player
  },
  excerpt: {
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 28,
    marginBottom: 24,
    fontFamily: 'Georgia',
  },
  contentText: {
    color: Colors.light.text,
    lineHeight: 24,
    fontFamily: 'Georgia',
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