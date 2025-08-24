import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, spacing, borderRadius } from '@/constants/typography';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onShowAll: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  onShowAll
}: CategoryFilterProps) {
  const { colors } = useTheme();
  const [showCategories, setShowCategories] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: selectedCategories.length === 0 ? colors.primary : colors.card, borderColor: selectedCategories.length === 0 ? colors.primary : colors.border }]}
          onPress={onShowAll}
        >
          <Text style={[styles.filterText, { color: selectedCategories.length === 0 ? colors.background : colors.text }]}>
            Alle
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: selectedCategories.length > 0 ? colors.primary : colors.card, borderColor: selectedCategories.length > 0 ? colors.primary : colors.border }]}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={[styles.filterText, { color: selectedCategories.length > 0 ? colors.background : colors.text }]}>
            Kategorier {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </Text>
          <ChevronDown size={16} color={selectedCategories.length > 0 ? colors.background : colors.text} />
        </TouchableOpacity>
      </View>
      
      {showCategories && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategories.includes(category) ? colors.accent : colors.card, borderColor: selectedCategories.includes(category) ? colors.accent : colors.border }
              ]}
              onPress={() => onCategoryToggle(category)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategories.includes(category) ? colors.background : colors.text }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    gap: spacing.xs,
  },
  filterText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
  },
  categoryScroll: {
    marginTop: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: spacing.lg,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  categoryChipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
  },
});