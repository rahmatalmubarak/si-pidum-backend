import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';

export default function TambahPerkaraScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    namaTersangka: '',
    jenisPerkara: '',
    tataUsahaPerkara: '',
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    const {
      namaTersangka,
      jenisPerkara,
      tataUsahaPerkara,
    } = form;

    if (
      !namaTersangka ||
      !jenisPerkara ||
      !tataUsahaPerkara
    ) {
      setErrorMessage('Semua field wajib diisi!');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log('Data Perkara:', form);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#56c596', '#82caff']} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: 40 },
        ]}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header dengan tombol kembali di kiri */}
        <View style={styles.headerRow}>
          <IconButton
            icon="arrow-left"
            size={26}
            iconColor="#fff"
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
          />
          <Text style={styles.header}>Tambah Daftar Perkara</Text>
          <View style={{ width: 48 }} /> {/* Spacer agar judul tetap di tengah */}
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.formGroup}>
              <TextInput
                label="Nama Tersangka"
                value={form.namaTersangka}
                onChangeText={(val) => handleChange('namaTersangka', val)}
                mode="outlined"
                style={styles.input}
                outlineColor="#ccc"
                activeOutlineColor="#0d6efd"
              />

              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerLabel}>Jenis Perkara</Text>
                <Picker
                  selectedValue={form.jenisPerkara}
                  onValueChange={(val) => handleChange('jenisPerkara', val)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Pilih Jenis Perkara --" value="" />
                  <Picker.Item label="Pencurian" value="Pencurian" />
                  <Picker.Item label="Korupsi" value="Korupsi" />
                </Picker>
              </View>

              <TextInput
                label="Tata Usaha Perkara"
                value={form.tataUsahaPerkara}
                onChangeText={(val) => handleChange('tataUsahaPerkara', val)}
                mode="outlined"
                style={styles.input}
                outlineColor="#ccc"
                activeOutlineColor="#0d6efd"
              />
            </View>

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <Divider style={{ marginVertical: 12 }} />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              labelStyle={{ color: '#fff', fontWeight: '600' }}
            >
              Simpan Perkara
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAwareScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
        style={{ backgroundColor: '#198754' }}
      >
        Perkara berhasil ditambahkan!
      </Snackbar>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 8,
  },
  formGroup: {
    marginTop: 8,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#0d6efd',
    borderRadius: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginBottom: 6,
    marginTop: -8,
  },
});
