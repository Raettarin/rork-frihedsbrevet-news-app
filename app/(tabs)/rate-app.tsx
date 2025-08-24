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
import { ArrowLeft, Star, Send, Heart, ThumbsUp } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <Star
            size={32}
            color={star <= rating ? '#FFD700' : colors.border}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RateAppScreen() {
  const { colors } = useTheme();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Vælg en bedømmelse', 'Vælg venligst hvor mange stjerner du vil give appen.');
      return;
    }

    setHasSubmitted(true);
    
    setTimeout(() => {
      Alert.alert(
        'Tak for din bedømmelse!',
        'Din feedback hjælper os med at forbedre Frihedsbrevet.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1000);
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Meget dårlig';
      case 2: return 'Dårlig';
      case 3: return 'Okay';
      case 4: return 'God';
      case 5: return 'Fremragende';
      default: return 'Vælg en bedømmelse';
    }
  };

  const getRatingColor = () => {
    if (rating === 0) return colors.textSecondary;
    if (rating <= 2) return '#e74c3c';
    if (rating === 3) return '#f39c12';
    return '#27ae60';
  };

  if (hasSubmitted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Custom Header with Back Button */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bedøm app</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.accent + '20' }]}>
            <Heart size={48} color={colors.accent} fill={colors.accent} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Tak for din bedømmelse!</Text>
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
            Din feedback er vigtig for os og hjælper os med at gøre Frihedsbrevet endnu bedre.
          </Text>
          <TouchableOpacity 
            style={[styles.doneButton, { backgroundColor: colors.accent }]}
            onPress={handleBack}
          >
            <Text style={[styles.doneButtonText, { color: colors.card }]}>Færdig</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bedøm app</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={[styles.appIcon, { backgroundColor: colors.accent + '20' }]}>
              <ThumbsUp size={32} color={colors.accent} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Hvordan synes du om Frihedsbrevet?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Din mening betyder meget for os. Hjælp os med at forbedre appen ved at give den en bedømmelse.
            </Text>
          </View>

          {/* Rating Section */}
          <View style={[styles.ratingSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>Giv appen en bedømmelse</Text>
            
            <StarRating rating={rating} onRatingChange={setRating} />
            
            <Text style={[styles.ratingText, { color: getRatingColor() }]}>
              {getRatingText()}
            </Text>
          </View>

          {/* Feedback Section */}
          <View style={[styles.feedbackSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.feedbackLabel, { color: colors.text }]}>Fortæl os mere (valgfrit)</Text>
            <Text style={[styles.feedbackDescription, { color: colors.textSecondary }]}>
              Hvad kan vi gøre bedre? Hvad elsker du ved appen?
            </Text>
            
            <TextInput
              style={[styles.feedbackInput, { color: colors.text, borderColor: colors.border }]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Del dine tanker med os..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: rating > 0 ? colors.accent : colors.border }]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Send size={16} color={rating > 0 ? colors.card : colors.textSecondary} />
            <Text style={[styles.submitButtonText, { color: rating > 0 ? colors.card : colors.textSecondary }]}>
              Send bedømmelse
            </Text>
          </TouchableOpacity>

          {/* App Store Link */}
          {rating >= 4 && (
            <View style={[styles.appStoreSection, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
              <Text style={[styles.appStoreTitle, { color: colors.text }]}>Elsker du Frihedsbrevet?</Text>
              <Text style={[styles.appStoreDescription, { color: colors.textSecondary }]}>
                Hjælp andre med at opdage appen ved at bedømme den i App Store.
              </Text>
              <TouchableOpacity style={[styles.appStoreButton, { backgroundColor: colors.accent }]}>
                <Star size={16} color={colors.card} fill={colors.card} />
                <Text style={[styles.appStoreButtonText, { color: colors.card }]}>Bedøm i App Store</Text>
              </TouchableOpacity>
            </View>
          )}
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
    alignItems: 'center',
    marginBottom: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  ratingSection: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  feedbackSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Georgia',
    marginBottom: 16,
  },
  feedbackInput: {
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
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  appStoreSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  appStoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  appStoreDescription: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Georgia',
    marginBottom: 16,
  },
  appStoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  appStoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Georgia',
    marginBottom: 32,
  },
  doneButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});