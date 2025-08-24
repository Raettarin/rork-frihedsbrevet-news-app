import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { typography, spacing, shadows } from '@/constants/typography';

interface HeaderProps {
  onSearchPress: () => void;
  onProfilePress: () => void;
  title?: string;
}

export default function Header({ onSearchPress, onProfilePress, title = 'Frihedsbrevet' }: HeaderProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
        <Search size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <TouchableOpacity onPress={() => { router.push('/(tabs)/profile'); onProfilePress(); }} style={styles.iconButton}>
        <User size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    ...shadows.medium,
    zIndex: 1000,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  iconButton: {
    padding: spacing.sm,
  },
});