import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  LogOut,
  ChevronRight,
  CreditCard,
  Settings,
  Bell,
  Moon,
  Sun,
  Type,
  Share2,
  HelpCircle,
  Shield,
  Mail,
  Star,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { router } from 'expo-router';
import { typography, spacing, borderRadius } from '@/constants/typography';

interface MenuItemProps {
  icon: React.ReactElement;
  title: string;
  onPress?: () => void;
  isLogout?: boolean;
}

function MenuItem({ icon, title, onPress, isLogout = false }: MenuItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: isLogout ? 'transparent' : colors.accent }]}>
          <Text style={styles.iconText}>■</Text>
        </View>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {!isLogout && (
        <ChevronRight size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { colors, isDark, updateDarkMode } = useTheme();
  const { isAuthenticated, logout, mockLogin } = useUser();
  const { currentTrack } = useAudioPlayer();
  const insets = useSafeAreaInsets();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const tabBarHeight = 60 + Math.max(insets.bottom, 0);
  const miniPlayerHeight = currentTrack ? 70 : 0;
  const bottomPadding = tabBarHeight + miniPlayerHeight;
  
  console.log('Profile screen - isLoggingOut:', isLoggingOut);

  const handleLogout = () => {
    Alert.alert(
      'Log ud',
      'Er du sikker på, at du vil logge ud?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Log ud',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleLogin = async () => {
    try {
      await mockLogin();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Fejl', 'Der opstod en fejl under login. Prøv igen.');
    }
  };

  const handleUserInfo = () => {
    router.push('/user-info');
  };

  const handleMembership = () => {
    router.push('/membership');
  };

  const handlePayments = () => {
    router.push('/payments');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleThemeToggle = async () => {
    try {
      await updateDarkMode(!isDark);
    } catch (error) {
      console.error('Error updating theme:', error);
      Alert.alert('Fejl', 'Der opstod en fejl ved ændring af tema.');
    }
  };

  const handleFontSize = () => {
    Alert.alert('Skriftstørrelse', 'Denne funktion er under udvikling.');
  };

  const handleShare = () => {
    Alert.alert('Del app', 'Denne funktion er under udvikling.');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  const handlePrivacy = () => {
    router.push('/privacy');
  };

  const handleContact = () => {
    router.push('/contact');
  };

  const handleRateApp = () => {
    router.push('/rate-app');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profil</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Login Section for Non-Authenticated Users */}
        {!isAuthenticated && (
          <View style={[styles.loginSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.loginTitle, { color: colors.text }]}>Log ind</Text>
            <Text style={[styles.loginSubtitle, { color: colors.textSecondary }]}>
              Log ind for at få adgang til dine oplysninger og indstillinger
            </Text>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.accent }]}
              onPress={handleLogin}
            >
              <Text style={[styles.loginButtonText, { color: colors.card }]}>Log ind med demo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Section for Authenticated Users */}
        {isAuthenticated && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>KONTO</Text>
            </View>
            <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
              <MenuItem
                icon={<User size={20} color={colors.accent} />}
                title="Dine oplysninger"
                onPress={handleUserInfo}
              />
              
              <MenuItem
                icon={<Settings size={20} color={colors.accent} />}
                title="Dit medlemskab"
                onPress={handleMembership}
              />
              
              <MenuItem
                icon={<CreditCard size={20} color={colors.accent} />}
                title="Dine betalinger"
                onPress={handlePayments}
              />
            </View>

            {/* Settings Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>INDSTILLINGER</Text>
            </View>
            <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
              <MenuItem
                icon={<Bell size={20} color={colors.accent} />}
                title="Notifikationer"
                onPress={handleNotifications}
              />
              
              <MenuItem
                icon={isDark ? <Sun size={20} color={colors.accent} /> : <Moon size={20} color={colors.accent} />}
                title="Mørkt tema"
                onPress={handleThemeToggle}
              />
              
              <MenuItem
                icon={<Type size={20} color={colors.accent} />}
                title="Skriftstørrelse"
                onPress={handleFontSize}
              />
            </View>

            {/* Support Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT</Text>
            </View>
            <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
              <MenuItem
                icon={<Share2 size={20} color={colors.accent} />}
                title="Del app"
                onPress={handleShare}
              />
              
              <MenuItem
                icon={<Star size={20} color={colors.accent} />}
                title="Bedøm app"
                onPress={handleRateApp}
              />
              
              <MenuItem
                icon={<HelpCircle size={20} color={colors.accent} />}
                title="Hjælp"
                onPress={handleHelp}
              />
              
              <MenuItem
                icon={<Shield size={20} color={colors.accent} />}
                title="Privatlivspolitik"
                onPress={handlePrivacy}
              />
              
              <MenuItem
                icon={<Mail size={20} color={colors.accent} />}
                title="Kontakt os"
                onPress={handleContact}
              />
            </View>

            {/* Logout Section */}
            <View style={[styles.menuSection, { backgroundColor: colors.card, marginTop: 24 }]}>
              <MenuItem
                icon={<LogOut size={20} color={colors.text} />}
                title="Log ud"
                onPress={handleLogout}
                isLogout
              />
            </View>
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loginSection: {
    margin: spacing.lg,
    padding: spacing['2xl'],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
    marginBottom: spacing.sm,
  },
  loginSubtitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.regular,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
  },
  loginButton: {
    paddingHorizontal: spacing['3xl'],
    paddingVertical: 14,
    borderRadius: borderRadius.md,
  },
  loginButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.medium,
  },
  menuSection: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl - 2,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginRight: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 8,
    color: 'transparent',
  },
  menuTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.normal,
    fontFamily: typography.fonts.serif,
  },

  sectionHeader: {
    marginHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.serif,
    letterSpacing: 0.5,
  },
});