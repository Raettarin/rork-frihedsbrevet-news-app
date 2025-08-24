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
import { ArrowLeft, Edit3, Save, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';

interface UserInfoFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
}

function UserInfoField({ label, value, onEdit, isEditing, onSave, onCancel }: UserInfoFieldProps) {
  const { colors } = useTheme();
  const [editValue, setEditValue] = useState<string>(value);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancel();
  };

  return (
    <View style={[styles.fieldContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
            value={editValue}
            onChangeText={setEditValue}
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleSave} style={[styles.actionButton, { backgroundColor: colors.accent }]}>
              <Save size={16} color={colors.card} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={[styles.actionButton, { backgroundColor: colors.textSecondary }]}>
              <X size={16} color={colors.card} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.valueContainer}>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Edit3 size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function UserInfoScreen() {
  const { colors } = useTheme();
  const { user } = useUser();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'Demo Bruger',
    email: user?.email || 'demo@frihedsbrevet.dk',
    phone: '+45 12 34 56 78',
    address: 'Eksempel Vej 123, 2100 København Ø',
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
    Alert.alert('Gemt', 'Dine oplysninger er blevet opdateret.');
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dine oplysninger</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Her kan du se og redigere dine personlige oplysninger.
          </Text>

          <UserInfoField
            label="Navn"
            value={userInfo.name}
            onEdit={() => handleEdit('name')}
            isEditing={editingField === 'name'}
            onSave={(value) => handleSave('name', value)}
            onCancel={handleCancel}
          />

          <UserInfoField
            label="E-mail"
            value={userInfo.email}
            onEdit={() => handleEdit('email')}
            isEditing={editingField === 'email'}
            onSave={(value) => handleSave('email', value)}
            onCancel={handleCancel}
          />

          <UserInfoField
            label="Telefon"
            value={userInfo.phone}
            onEdit={() => handleEdit('phone')}
            isEditing={editingField === 'phone'}
            onSave={(value) => handleSave('phone', value)}
            onCancel={handleCancel}
          />

          <UserInfoField
            label="Adresse"
            value={userInfo.address}
            onEdit={() => handleEdit('address')}
            isEditing={editingField === 'address'}
            onSave={(value) => handleSave('address', value)}
            onCancel={handleCancel}
          />
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
  fieldContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Georgia',
  },
  editButton: {
    padding: 8,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    fontFamily: 'Georgia',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  bottomSpacing: {
    height: 100,
  },
});