import React from 'react';
import { View, StyleSheet } from 'react-native';
import MiniPlayer from '@/components/MiniPlayer';
import FullPlayer from '@/components/FullPlayer';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  showMiniPlayer?: boolean;
}

export default function AppLayoutWrapper({ children, showMiniPlayer = true }: AppLayoutWrapperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      {showMiniPlayer && <MiniPlayer />}
      <FullPlayer />
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
});