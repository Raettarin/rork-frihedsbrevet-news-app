import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle, Search, Book, Headphones } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.faqItem, { borderColor: colors.border }]}>
      <TouchableOpacity onPress={onToggle} style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
        {isExpanded ? (
          <ChevronDown size={20} color={colors.textSecondary} />
        ) : (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqContent}>
          <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

interface HelpCategoryProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  onPress: () => void;
}

function HelpCategory({ icon, title, description, onPress }: HelpCategoryProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.categoryIcon, { backgroundColor: colors.accent + '20' }]}>
        {React.cloneElement(icon)}
      </View>
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const { colors } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleBack = () => {
    router.back();
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: 'Hvordan downloader jeg artikler til offline læsning?',
      answer: 'Tryk på download-ikonet i toppen af en artikel for at gemme den til offline læsning. Du kan finde dine downloadede artikler i "Gemt" sektionen.'
    },
    {
      question: 'Kan jeg lytte til artikler?',
      answer: 'Ja, mange af vores artikler har en indbygget oplæsningsfunktion. Tryk på play-knappen for at starte oplæsningen.'
    },
    {
      question: 'Hvordan ændrer jeg skriftstørrelsen?',
      answer: 'Gå til Profil > Indstillinger > Skriftstørrelse for at justere tekststørrelsen i artikler.'
    },
    {
      question: 'Hvordan gemmer jeg artikler og podcasts?',
      answer: 'Tryk på bogmærke-ikonet på enhver artikel eller podcast for at gemme den. Find dine gemte elementer under "Gemt" fanen.'
    },
    {
      question: 'Kan jeg dele artikler med andre?',
      answer: 'Ja, tryk på del-ikonet i toppen af en artikel for at dele den via sociale medier, e-mail eller andre apps.'
    },
  ];

  const helpCategories = [
    {
      icon: <Book size={24} color={colors.accent} />,
      title: 'Læsning og artikler',
      description: 'Hjælp til læsning, download og deling af artikler'
    },
    {
      icon: <Headphones size={24} color={colors.accent} />,
      title: 'Podcasts og lyd',
      description: 'Hjælp til afspilning og download af podcasts'
    },
    {
      icon: <Search size={24} color={colors.accent} />,
      title: 'Søgning og navigation',
      description: 'Find indhold og naviger i appen'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hjælp</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Find svar på almindelige spørgsmål eller kontakt os for yderligere hjælp.
          </Text>

          {/* Help Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hjælpekategorier</Text>
            {helpCategories.map((category, index) => (
              <HelpCategory
                key={index}
                icon={category.icon}
                title={category.title}
                description={category.description}
                onPress={() => {}}
              />
            ))}
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ofte stillede spørgsmål</Text>
            <View style={[styles.faqContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isExpanded={expandedFAQ === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </View>
          </View>

          {/* Contact Support */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kontakt support</Text>
            <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.contactIcon, { backgroundColor: colors.accent + '20' }]}>
                <HelpCircle size={24} color={colors.accent} />
              </View>
              <View style={styles.contactContent}>
                <Text style={[styles.contactTitle, { color: colors.text }]}>Har du stadig brug for hjælp?</Text>
                <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                  Kontakt vores supportteam, så hjælper vi dig gerne videre.
                </Text>
                <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.contactButtonText, { color: colors.card }]}>Kontakt support</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Georgia',
  },
  faqContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    flex: 1,
    marginRight: 12,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Georgia',
  },
  contactCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  contactButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});