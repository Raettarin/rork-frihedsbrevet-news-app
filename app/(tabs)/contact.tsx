import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface ContactMethodProps {
  icon: React.ReactElement;
  title: string;
  value: string;
  onPress: () => void;
}

function ContactMethod({ icon, title, value, onPress }: ContactMethodProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.contactMethod, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.methodIcon, { backgroundColor: colors.accent + '20' }]}>
        {React.cloneElement(icon)}
      </View>
      <View style={styles.methodContent}>
        <Text style={[styles.methodTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.methodValue, { color: colors.textSecondary }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ContactScreen() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Fejl', 'Udfyld venligst alle påkrævede felter.');
      return;
    }
    
    Alert.alert(
      'Besked sendt',
      'Tak for din henvendelse. Vi vender tilbage til dig inden for 24 timer.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kontakt os</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Vi er her for at hjælpe dig. Kontakt os via en af metoderne nedenfor eller send os en besked.
          </Text>

          {/* Contact Methods */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kontaktoplysninger</Text>
            
            <ContactMethod
              icon={<Mail size={20} color={colors.accent} />}
              title="E-mail"
              value="kontakt@frihedsbrevet.dk"
              onPress={() => {}}
            />
            
            <ContactMethod
              icon={<Phone size={20} color={colors.accent} />}
              title="Telefon"
              value="+45 12 34 56 78"
              onPress={() => {}}
            />
            
            <ContactMethod
              icon={<MapPin size={20} color={colors.accent} />}
              title="Adresse"
              value="Frihedsbrevet ApS\nEksempel Vej 123\n2100 København Ø"
              onPress={() => {}}
            />
          </View>

          {/* Contact Form */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Send os en besked</Text>
            
            <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Navn *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="Dit fulde navn"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>E-mail *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="din@email.dk"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Emne</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                  value={formData.subject}
                  onChangeText={(value) => updateFormData('subject', value)}
                  placeholder="Hvad drejer din henvendelse sig om?"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Besked *</Text>
                <TextInput
                  style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                  value={formData.message}
                  onChangeText={(value) => updateFormData('message', value)}
                  placeholder="Beskriv din henvendelse i detaljer..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: colors.accent }]}
                onPress={handleSubmit}
              >
                <Send size={16} color={colors.card} />
                <Text style={[styles.submitButtonText, { color: colors.card }]}>Send besked</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FAQ Link */}
          <View style={[styles.faqSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.faqIcon, { backgroundColor: colors.accent + '20' }]}>
              <MessageCircle size={20} color={colors.accent} />
            </View>
            <View style={styles.faqContent}>
              <Text style={[styles.faqTitle, { color: colors.text }]}>Ofte stillede spørgsmål</Text>
              <Text style={[styles.faqDescription, { color: colors.textSecondary }]}>
                Måske finder du svaret på dit spørgsmål i vores FAQ sektion.
              </Text>
              <TouchableOpacity 
                style={[styles.faqButton, { borderColor: colors.accent }]}
                onPress={() => router.push('/help')}
              >
                <Text style={[styles.faqButtonText, { color: colors.accent }]}>Se FAQ</Text>
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
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  methodValue: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Georgia',
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Georgia',
    minHeight: 120,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  faqSection: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  faqIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  faqContent: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  faqDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Georgia',
    marginBottom: 12,
  },
  faqButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  faqButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});