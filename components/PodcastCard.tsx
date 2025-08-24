import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { Podcast } from '@/types/content';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { typography, shadows, spacing, borderRadius } from '@/constants/typography';

interface PodcastCardProps {
  podcast: Podcast;
  size?: 'grid' | 'list';
  onPress: () => void;
  onPlayPress?: () => void;
}

export default function PodcastCard({ 
  podcast, 
  size = 'list', 
  onPress,
  onPlayPress 
}: PodcastCardProps) {
  const { colors } = useTheme();
  const { isPodcastSaved, togglePodcastSave } = useSavedItems();
  const isSaved = isPodcastSaved(podcast.id);

  const handleSavePress = async () => {
    try {
      await togglePodcastSave(podcast);
    } catch (error) {
      console.error('Error toggling podcast save:', error);
    }
  };
  const cardStyle = size === 'grid' ? styles.gridCard : styles.listCard;
  const imageStyle = size === 'grid' ? styles.gridImage : styles.listImage;

  return (
    <TouchableOpacity style={[cardStyle, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: podcast.coverImage }} style={imageStyle} />
        <TouchableOpacity 
          style={[styles.playOverlay, size === 'list' && { borderTopLeftRadius: borderRadius.md, borderTopRightRadius: 0, borderBottomLeftRadius: borderRadius.md, borderBottomRightRadius: 0 }]}
          onPress={onPlayPress || onPress}
          activeOpacity={0.8}
        >
          <Play size={size === 'grid' ? 24 : 20} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.category, { color: colors.accent }]}>{podcast.category}</Text>
          </View>
          
          <TouchableOpacity onPress={handleSavePress} style={styles.saveButton}>
            {isSaved ? (
              <BookmarkCheck size={14} color={colors.accent} />
            ) : (
              <Bookmark size={14} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {podcast.title}
        </Text>
        
        <Text style={[styles.episodeInfo, { color: colors.textSecondary }]}>
          {podcast.totalSeasons} {podcast.totalSeasons === 1 ? 'sæson' : 'sæsoner'} • {podcast.totalEpisodes} episoder
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    borderRadius: borderRadius.lg,
    width: '48%',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  listCard: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    ...shadows.small,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  listImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  content: {
    padding: spacing.md,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  categoryContainer: {
    flex: 1,
  },
  category: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.medium,
    textTransform: 'uppercase',
  },
  saveButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
    marginBottom: spacing.xs,
  },
  episodeInfo: {
    fontSize: typography.sizes.xs + 1,
    fontFamily: typography.fonts.regular,
  },
});