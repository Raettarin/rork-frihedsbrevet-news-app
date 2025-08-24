import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Play, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { Article } from '@/types/content';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { typography, shadows, spacing, borderRadius } from '@/constants/typography';

interface ArticleCardProps {
  article: Article;
  size?: 'medium' | 'small';
  onPress: () => void;
  onPlayPress?: () => void;
}

export default function ArticleCard({ 
  article, 
  size = 'medium', 
  onPress, 
  onPlayPress 
}: ArticleCardProps) {
  const { colors } = useTheme();
  const { isArticleSaved, toggleArticleSave } = useSavedItems();
  const isSaved = isArticleSaved(article.id);

  const handleSavePress = async () => {
    try {
      await toggleArticleSave(article);
    } catch (error) {
      console.error('Error toggling article save:', error);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardStyle = size === 'small' ? styles.smallCard : styles.mediumCard;
  const imageStyle = size === 'small' ? styles.smallImage : styles.mediumImage;

  return (
    <TouchableOpacity style={[cardStyle, { backgroundColor: colors.card }]} onPress={onPress}>
      <Image source={{ uri: article.coverImage }} style={imageStyle} />
      
      <View style={styles.content}>
        <View style={styles.categoryContainer}>
          <Text style={[styles.category, { color: colors.accent }]}>{article.category}</Text>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={size === 'small' ? 2 : 3}>
          {article.title}
        </Text>
        
        <View style={styles.metadata}>
          <Text style={[styles.journalist, { color: colors.text }]}>{article.journalist}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(article.publishedAt)}</Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.readTime}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.readTimeText, { color: colors.textSecondary }]}>{article.readTime} min</Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSavePress} style={styles.saveButton}>
              {isSaved ? (
                <BookmarkCheck size={16} color={colors.accent} />
              ) : (
                <Bookmark size={16} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
            
            {article.audioUrl && onPlayPress && (
              <TouchableOpacity onPress={onPlayPress} style={styles.playButton}>
                <Play size={16} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mediumCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  smallCard: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    ...shadows.small,
  },
  mediumImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  smallImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  },
  content: {
    padding: spacing.lg,
    flex: 1,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
  },
  category: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.medium,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
    marginBottom: spacing.sm,
  },
  metadata: {
    marginBottom: spacing.md,
  },
  journalist: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  readTimeText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  saveButton: {
    padding: spacing.sm,
  },
  playButton: {
    padding: spacing.sm,
  },
});