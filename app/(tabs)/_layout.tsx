import { Tabs } from "expo-router";
import { Home, FileText, Headphones, Bookmark } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import MiniPlayer from "@/components/MiniPlayer";
import FullPlayer from "@/components/FullPlayer";
import { typography, spacing } from "@/constants/typography";

export default function TabLayout() {
  const { colors } = useTheme();
  const { currentTrack, isMiniPlayerDismissed } = useAudioPlayer();
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = 60;
  const miniPlayerHeight = (currentTrack && !isMiniPlayerDismissed) ? 70 : 0;
  
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: insets.bottom,
            height: tabBarHeight + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            fontFamily: typography.fonts.medium,
            marginTop: spacing.xs,
          },
        }}
        >
      <Tabs.Screen
        name="index"
        options={{
          title: "Forside",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: "Artikler",
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="podcasts"
        options={{
          title: "Podcasts",
          tabBarIcon: ({ color, size }) => <Headphones color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Gemt",
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="user-info"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="membership"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="rate-app"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="article-[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="podcast-[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
        </Tabs>
      
      {/* Mini Player positioned above tab bar */}
      {currentTrack && !isMiniPlayerDismissed && (
        <View style={[
          styles.miniPlayerContainer,
          {
            bottom: tabBarHeight + insets.bottom,
          }
        ]}>
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
  miniPlayerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});