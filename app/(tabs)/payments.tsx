import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, CreditCard, Download, Calendar } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface PaymentHistoryItemProps {
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

function PaymentHistoryItem({ date, amount, status, description }: PaymentHistoryItemProps) {
  const { colors } = useTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'paid': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'failed': return '#e74c3c';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'paid': return 'Betalt';
      case 'pending': return 'Afventer';
      case 'failed': return 'Fejlet';
      default: return 'Ukendt';
    }
  };

  return (
    <View style={[styles.paymentItem, { borderColor: colors.border }]}>
      <View style={styles.paymentHeader}>
        <Text style={[styles.paymentDate, { color: colors.text }]}>{date}</Text>
        <Text style={[styles.paymentAmount, { color: colors.text }]}>{amount}</Text>
      </View>
      <View style={styles.paymentDetails}>
        <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>{description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PaymentsScreen() {
  const { colors } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const paymentHistory = [
    {
      date: '15. dec 2024',
      amount: '149 kr',
      status: 'paid' as const,
      description: 'Månedligt abonnement - December 2024'
    },
    {
      date: '15. nov 2024',
      amount: '149 kr',
      status: 'paid' as const,
      description: 'Månedligt abonnement - November 2024'
    },
    {
      date: '15. okt 2024',
      amount: '149 kr',
      status: 'paid' as const,
      description: 'Månedligt abonnement - Oktober 2024'
    },
    {
      date: '15. sep 2024',
      amount: '149 kr',
      status: 'paid' as const,
      description: 'Månedligt abonnement - September 2024'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dine betalinger</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Current Payment Method */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Betalingsmetode</Text>
            <View style={[styles.paymentMethodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.paymentMethodHeader}>
                <CreditCard size={24} color={colors.accent} />
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.cardNumber, { color: colors.text }]}>•••• •••• •••• 1234</Text>
                  <Text style={[styles.cardType, { color: colors.textSecondary }]}>Visa • Udløber 12/26</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.changeButton, { borderColor: colors.accent }]}>
                <Text style={[styles.changeButtonText, { color: colors.accent }]}>Skift kort</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Next Payment */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Næste betaling</Text>
            <View style={[styles.nextPaymentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.nextPaymentRow}>
                <Calendar size={20} color={colors.accent} />
                <Text style={[styles.nextPaymentText, { color: colors.text }]}>15. januar 2025</Text>
              </View>
              <Text style={[styles.nextPaymentAmount, { color: colors.text }]}>149 kr</Text>
            </View>
          </View>

          {/* Payment History */}
          <View style={styles.section}>
            <View style={styles.historyHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Betalingshistorik</Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color={colors.accent} />
                <Text style={[styles.downloadText, { color: colors.accent }]}>Download</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {paymentHistory.map((payment, index) => (
                <PaymentHistoryItem
                  key={index}
                  date={payment.date}
                  amount={payment.amount}
                  status={payment.status}
                  description={payment.description}
                />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 12,
  },
  paymentMethodCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  nextPaymentCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPaymentText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    marginLeft: 8,
  },
  nextPaymentAmount: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  historyCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  paymentItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDescription: {
    fontSize: 14,
    fontFamily: 'Georgia',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  bottomSpacing: {
    height: 100,
  },
});