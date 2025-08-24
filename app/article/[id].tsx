import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Pause, Type, Share as ShareIcon, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { mockArticles } from '@/mocks/articles';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useTheme } from '@/contexts/ThemeContext';
import MiniPlayer from '@/components/MiniPlayer';
import FullPlayer from '@/components/FullPlayer';
import { typography, spacing, borderRadius } from '@/constants/typography';

export default function ArticlePostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [fontSize, setFontSize] = useState<number>(16);
  const { isArticleSaved, toggleArticleSave } = useSavedItems();
  const { playTrack, pauseTrack, resumeTrack, currentTrack, isPlaying, isMiniPlayerDismissed } = useAudioPlayer();
  
  const miniPlayerHeight = (currentTrack && !isMiniPlayerDismissed) ? 70 : 0;
  const bottomPadding = miniPlayerHeight + spacing.lg;

  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Artikel ikke fundet</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.accent }]}>
            <Text style={[styles.backButtonText, { color: colors.background }]}>Gå tilbage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePlayPress = async () => {
    if (!article?.audioUrl) return;

    try {
      if (currentTrack?.id === article.id) {
        // Same track - toggle play/pause
        if (isPlaying) {
          await pauseTrack();
        } else {
          await resumeTrack();
        }
      } else {
        // New track - start playing
        await playTrack({
          id: article.id,
          title: article.title,
          audioUrl: article.audioUrl,
          type: 'article',
          coverImage: article.coverImage,
          category: article.category,
        });
      }
      console.log('Toggle audio playback:', article.id);
    } catch (error) {
      console.error('Error playing article:', error);
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
        {/* Cover Image */}
        <Image source={{ uri: article.coverImage }} style={styles.coverImage} />
        
        {/* Article Meta */}
        <View style={styles.articleMeta}>
          <View style={[styles.categoryContainer, { backgroundColor: colors.accent }]}>
            <Text style={[styles.category, { color: colors.background }]}>{article.category}</Text>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={[styles.journalist, { color: colors.text }]}>Af {article.journalist}</Text>
            <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(article.publishedAt)}</Text>
            <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.readTime, { color: colors.textSecondary }]}>{article.readTime} min. læsning</Text>
          </View>
        </View>

        {/* Audio Player & Font Controls */}
        <View style={[styles.controls, { borderColor: colors.border }]}>
          {article.audioUrl && (
            <TouchableOpacity onPress={handlePlayPress} style={[styles.playButton, { backgroundColor: colors.accent }]}>
              {(currentTrack?.id === article.id && isPlaying) ? (
                <Pause color={colors.background} size={20} />
              ) : (
                <Play color={colors.background} size={20} />
              )}
              <Text style={[styles.playButtonText, { color: colors.background }]}>
                {(currentTrack?.id === article.id && isPlaying) ? 'Pause' : 'Lyt til artikel'}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.fontControls}>
            <TouchableOpacity onPress={decreaseFontSize} style={styles.fontButton}>
              <Type color={colors.text} size={16} />
              <Text style={[styles.fontButtonText, { color: colors.text }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={increaseFontSize} style={styles.fontButton}>
              <Type color={colors.text} size={20} />
              <Text style={[styles.fontButtonText, { color: colors.text }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <Text style={[styles.excerpt, { fontSize: fontSize + 2, color: colors.text }]}>{article.excerpt}</Text>
          <Text style={[styles.contentText, { fontSize, color: colors.text }]}>{article.content}</Text>
        </View>
      </ScrollView>
      
      {/* Mini Player positioned above bottom */}
      {currentTrack && !isMiniPlayerDismissed && (
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
  coverImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  articleMeta: {
    padding: spacing.lg,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
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
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes['3xl'] * typography.lineHeights.tight,
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.serif,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  journalist: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.serif,
  },
  separator: {
    fontSize: typography.sizes.base,
    marginHorizontal: spacing.sm,
  },
  date: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.serif,
  },
  readTime: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.serif,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  playButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  fontControls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fontButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  fontButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  articleContent: {
    padding: spacing.lg,
  },
  excerpt: {
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing['2xl'],
    fontFamily: typography.fonts.serif,
  },
  contentText: {
    lineHeight: typography.lineHeights.relaxed,
    fontFamily: typography.fonts.serif,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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