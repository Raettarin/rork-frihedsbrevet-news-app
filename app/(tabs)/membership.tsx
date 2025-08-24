import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Crown, Calendar, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface MembershipBenefitProps {
  title: string;
  description: string;
}

function MembershipBenefit({ title, description }: MembershipBenefitProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.benefitItem}>
      <CheckCircle size={20} color={colors.accent} style={styles.benefitIcon} />
      <View style={styles.benefitContent}>
        <Text style={[styles.benefitTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>{description}</Text>
      </View>
    </View>
  );
}

export default function MembershipScreen() {
  const { colors } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const benefits = [
    {
      title: 'Ubegrænset adgang',
      description: 'Læs alle artikler og lyt til alle podcasts uden begrænsninger'
    },
    {
      title: 'Offline læsning',
      description: 'Download artikler og podcasts til offline læsning og lytning'
    },
    {
      title: 'Tidlig adgang',
      description: 'Få adgang til nyt indhold før andre læsere'
    },
    {
      title: 'Eksklusive interviews',
      description: 'Adgang til medlemseksklusive interviews og analyser'
    },
    {
      title: 'Ingen reklamer',
      description: 'Oplev Frihedsbrevet helt uden forstyrrende reklamer'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dit medlemskab</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Current Membership Status */}
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statusHeader}>
              <Crown size={24} color={colors.accent} />
              <Text style={[styles.statusTitle, { color: colors.text }]}>Premium Medlem</Text>
            </View>
            <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
              Du har fuld adgang til alt indhold på Frihedsbrevet
            </Text>
            
            <View style={styles.statusDetails}>
              <View style={styles.statusRow}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>Næste fakturering: 15. januar 2025</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={[styles.priceText, { color: colors.text }]}>149 kr/måned</Text>
              </View>
            </View>
          </View>

          {/* Membership Benefits */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dine medlemsfordele</Text>
            <View style={[styles.benefitsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {benefits.map((benefit, index) => (
                <MembershipBenefit
                  key={index}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </View>
          </View>

          {/* Manage Subscription */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Administrer abonnement</Text>
            <View style={[styles.actionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Skift betalingsmetode</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Pause abonnement</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                <Text style={[styles.actionButtonText, { color: '#e74c3c' }]}>Opsig abonnement</Text>
              </TouchableOpacity>
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
  statusCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  statusDetails: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 12,
  },
  benefitsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  benefitIcon: {
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Georgia',
  },
  actionsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionButton: {
    padding: 16,
    borderBottomWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});