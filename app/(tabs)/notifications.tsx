import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Bell, Clock, Newspaper, Headphones } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface NotificationSettingProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function NotificationSetting({ icon, title, description, value, onToggle }: NotificationSettingProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.settingItem, { borderColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
          {React.cloneElement(icon)}
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accent + '40' }}
        thumbColor={value ? colors.accent : colors.textSecondary}
      />
    </View>
  );
}

interface TimeSettingProps {
  title: string;
  time: string;
  onPress: () => void;
}

function TimeSetting({ title, time, onPress }: TimeSettingProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.timeSettingItem, { borderColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.timeSettingTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.timeSettingValue, { color: colors.accent }]}>{time}</Text>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({
    breakingNews: true,
    newArticles: true,
    newPodcasts: false,
    weeklyDigest: true,
    pushNotifications: true,
  });

  const handleBack = () => {
    router.back();
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifikationer</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Tilpas dine notifikationsindstillinger for at få besked om det, der er vigtigst for dig.
          </Text>

          {/* Push Notifications */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Push-notifikationer</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <NotificationSetting
                icon={<Bell size={20} color={colors.accent} />}
                title="Aktiver push-notifikationer"
                description="Modtag notifikationer på din enhed"
                value={settings.pushNotifications}
                onToggle={() => toggleSetting('pushNotifications')}
              />
            </View>
          </View>

          {/* Content Notifications */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Indhold</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <NotificationSetting
                icon={<Bell size={20} color={colors.accent} />}
                title="Breaking news"
                description="Vigtige nyheder og opdateringer"
                value={settings.breakingNews}
                onToggle={() => toggleSetting('breakingNews')}
              />
              <NotificationSetting
                icon={<Newspaper size={20} color={colors.accent} />}
                title="Nye artikler"
                description="Få besked når nye artikler udgives"
                value={settings.newArticles}
                onToggle={() => toggleSetting('newArticles')}
              />
              <NotificationSetting
                icon={<Headphones size={20} color={colors.accent} />}
                title="Nye podcasts"
                description="Få besked når nye podcast-episoder udgives"
                value={settings.newPodcasts}
                onToggle={() => toggleSetting('newPodcasts')}
              />
              <NotificationSetting
                icon={<Clock size={20} color={colors.accent} />}
                title="Ugentligt sammendrag"
                description="Modtag et ugentligt sammendrag af ugens vigtigste nyheder"
                value={settings.weeklyDigest}
                onToggle={() => toggleSetting('weeklyDigest')}
              />
            </View>
          </View>

          {/* Timing Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tidspunkter</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TimeSetting
                title="Stille timer"
                time="22:00 - 08:00"
                onPress={() => {}}
              />
              <TimeSetting
                title="Ugentligt sammendrag"
                time="Søndag 09:00"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategorier</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Vælg hvilke kategorier du vil modtage notifikationer fra
            </Text>
            <View style={[styles.categoriesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {['MeToo', 'Fríur Politikkur', 'Frítt Samfelag', 'Frí Kommuna', 'Frí Vinna'].map((category, index) => (
                <TouchableOpacity key={index} style={[styles.categoryItem, { borderColor: colors.border }]}>
                  <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
                  <Switch
                    value={index < 3}
                    onValueChange={() => {}}
                    trackColor={{ false: colors.border, true: colors.accent + '40' }}
                    thumbColor={index < 3 ? colors.accent : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Georgia',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Georgia',
  },
  timeSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  timeSettingTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  timeSettingValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  categoriesCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});