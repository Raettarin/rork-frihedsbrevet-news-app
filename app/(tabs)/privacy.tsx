import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface PrivacySectionProps {
  icon: React.ReactElement;
  title: string;
  content: string;
}

function PrivacySection({ icon, title, content }: PrivacySectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: colors.accent + '20' }]}>
          {React.cloneElement(icon)}
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{content}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const { colors } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const privacySections = [
    {
      icon: <Database size={20} color={colors.accent} />,
      title: 'Dataindsamling',
      content: 'Vi indsamler kun de data, der er nødvendige for at levere vores tjenester. Dette inkluderer din e-mailadresse, læsepræferencer og brugsstatistikker for at forbedre din oplevelse.'
    },
    {
      icon: <Eye size={20} color={colors.accent} />,
      title: 'Hvordan vi bruger dine data',
      content: 'Dine data bruges til at personalisere dit indhold, sende relevante notifikationer og forbedre vores tjenester. Vi sælger aldrig dine personlige oplysninger til tredjeparter.'
    },
    {
      icon: <Lock size={20} color={colors.accent} />,
      title: 'Datasikkerhed',
      content: 'Vi bruger industristandarder for kryptering og sikkerhed for at beskytte dine data. Alle data transmitteres sikkert og opbevares på sikre servere.'
    },
    {
      icon: <Shield size={20} color={colors.accent} />,
      title: 'Dine rettigheder',
      content: 'Du har ret til at få indsigt i, rette eller slette dine personlige data. Du kan også trække dit samtykke tilbage på ethvert tidspunkt ved at kontakte os.'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privatlivspolitik</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: colors.text }]}>Privatlivspolitik</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sidst opdateret: 15. december 2024
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Hos Frihedsbrevet tager vi dit privatliv alvorligt. Denne politik forklarer, hvordan vi indsamler, bruger og beskytter dine personlige oplysninger.
            </Text>
          </View>

          {privacySections.map((section, index) => (
            <PrivacySection
              key={index}
              icon={section.icon}
              title={section.title}
              content={section.content}
            />
          ))}

          {/* Additional Information */}
          <View style={[styles.additionalInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.additionalTitle, { color: colors.text }]}>Cookies og tracking</Text>
            <Text style={[styles.additionalContent, { color: colors.textSecondary }]}>
              Vi bruger cookies og lignende teknologier til at forbedre din brugeroplevelse, analysere trafik og personalisere indhold. Du kan administrere dine cookie-præferencer i din browsers indstillinger.
            </Text>
          </View>

          <View style={[styles.additionalInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.additionalTitle, { color: colors.text }]}>Tredjepartstjenester</Text>
            <Text style={[styles.additionalContent, { color: colors.textSecondary }]}>
              Vi bruger tredjepartstjenester som analyseværktøjer og betalingsprocessorer. Disse tjenester har deres egne privatlivspolitikker, som vi opfordrer dig til at læse.
            </Text>
          </View>

          <View style={[styles.additionalInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.additionalTitle, { color: colors.text }]}>Ændringer til denne politik</Text>
            <Text style={[styles.additionalContent, { color: colors.textSecondary }]}>
              Vi kan opdatere denne privatlivspolitik fra tid til anden. Væsentlige ændringer vil blive kommunikeret via e-mail eller gennem appen.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={[styles.contactSection, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
            <Text style={[styles.contactTitle, { color: colors.text }]}>Har du spørgsmål?</Text>
            <Text style={[styles.contactContent, { color: colors.textSecondary }]}>
              Hvis du har spørgsmål om denne privatlivspolitik eller ønsker at udøve dine rettigheder, kan du kontakte os på:
            </Text>
            <Text style={[styles.contactEmail, { color: colors.accent }]}>privatliv@frihedsbrevet.dk</Text>
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
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Georgia',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Georgia',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Georgia',
  },
  additionalInfo: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  additionalContent: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Georgia',
  },
  contactSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  contactContent: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});