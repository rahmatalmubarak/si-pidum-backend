import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  IconButton,
  Dialog,
  Portal,
  Button,
  TextInput,
  Chip
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const initialPerkara = [
  { id: 1, title: 'Perkara Tanah', status: 'Proses' },
  { id: 2, title: 'Perkara Waris', status: 'Selesai' },
  { id: 3, title: 'Perkara Perdata', status: 'Proses' },
  { id: 4, title: 'Perkara Pidana', status: 'Selesai' },
];

const hearingsToday = [
  { id: 1, title: 'Perkara Tanah', time: '10:00' },
  { id: 2, title: 'Perkara Waris', time: '13:30' },
];

const hearingsNext = [
  { id: 3, title: 'Perkara Perdata', date: '27 Jun 2025', time: '09:00' },
  { id: 4, title: 'Perkara Pidana', date: '29 Jun 2025', time: '11:00' },
];

export default function HomeScreen({ navigation }) {
  const [perkaraList, setPerkaraList] = useState(initialPerkara);
  /*  RefreshControl */
  const [refreshing, setRefreshing] = useState(false);

  /** Tarik-untuk-refresh */
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // 🔄 Simulasi fetch data 1.5 detik ––––––
    setTimeout(() => {
      // contoh: di sini Anda bisa memanggil API dan mem-set state baru
      setPerkaraList([...initialPerkara]); // mis. update dari server
      setRefreshing(false);
    }, 1500);
  }, []);

  const insets = useSafeAreaInsets();

  const selesaiCount = perkaraList.filter(p => p.status === 'Selesai').length;
  const dalamProses = perkaraList.length - selesaiCount;
  const total = selesaiCount + dalamProses;

  const selesaiPercent = Math.round((selesaiCount / total) * 100);
  const belumPercent = 100 - selesaiPercent;

  const pieData = [
    {
      name: `Selesai (${selesaiPercent}%)`,
      count: selesaiCount,
      color: '#28a745',
      legendFontColor: '#000',
      legendFontSize: 14,
    },
    {
      name: `Proses (${belumPercent}%)`,
      count: dalamProses,
      color: '#ff6b6b',
      legendFontColor: '#000',
      legendFontSize: 14,
    },
  ];

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [selectedNextAgenda, setSelectedNextAgenda] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDialog = (agenda) => {
    setSelectedAgenda(agenda);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSelectedAgenda(null);
    setSelectedNextAgenda('');
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  const showDateSelector = () => setShowDatePicker(true);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleUbah = () => {
    console.log('Ubah:', selectedNextAgenda, selectedDate);
    hideDialog();
  };

  return (
    <LinearGradient colors={['#56c596', '#82caff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0d6efd']}
          tintColor="#fff"
        />
      }
      >
        <Text style={styles.header}>Dashboard Perkara</Text>
        <Text style={styles.subHeader}>Total Perkara: {perkaraList.length}</Text>

        <Card style={styles.card}>
          <Card.Title title="Statistik Perkara" titleStyle={{ fontWeight: '700' }} />
          <Card.Content style={{ paddingBottom: 16 }}>
            <PieChart
              data={pieData}
              width={SCREEN_WIDTH - 80}
              height={180}
              chartConfig={{ backgroundColor: '#ffffff', color: () => '#000' }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="10"
              hasLegend
              center={[0, 0]}
              absolute
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Agenda Sidang" titleStyle={{ fontWeight: '700' }} />
          <View style={styles.agendaSection}>
            <Text style={styles.agendaTitle}>Hari Ini</Text>
            {hearingsToday.map(h => (
              <View key={h.id} style={styles.itemRow}>
                <Avatar.Icon size={36} icon="calendar-clock" style={styles.iconGreen} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{h.title}</Text>
                  <Text style={styles.itemStatus}>Pukul {h.time}</Text>
                </View>
                <IconButton
                  icon="pencil"
                  onPress={() => openDialog(h)}
                  style={{ backgroundColor: '#6c757d' }}
                  iconColor="#fff"
                />
              </View>
            ))}

            <Text style={styles.agendaTitle}>Selanjutnya</Text>
            {hearingsNext.map(h => (
              <View key={h.id} style={styles.itemRow}>
                <Avatar.Icon size={36} icon="calendar-arrow-right" style={styles.iconOrange} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{h.title}</Text>
                  <Text style={styles.itemStatus}>{h.date} • {h.time}</Text>
                </View>
                <IconButton
                  icon="pencil"
                  onPress={() => openDialog(h)}
                  style={{ backgroundColor: '#6c757d' }}
                  iconColor="#fff"
                />
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Daftar Perkara</Text>
        {perkaraList.map(item => {
          const isDone = item.status === 'Selesai';
          const iconColor = isDone ? '#28a745' : '#ffc107';
          const chipColor = isDone ? '#d1e7dd' : '#fff3cd';
          const chipText = isDone ? '#0f5132' : '#664d03';
          return (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <Avatar.Icon size={40} icon="gavel" style={[styles.iconBlue, { backgroundColor: iconColor }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Chip style={[styles.statusChip, { backgroundColor: chipColor }]} textStyle={{ color: chipText }}>
                    {item.status}
                  </Chip>
                </View>
              </View>
            </Card>
          );
        })}
        <Button
          icon="plus"
          mode="contained"
          style={{ marginTop: 12, marginBottom: 24, backgroundColor: '#0d6efd', borderRadius: 8 }}
          onPress={() => navigation.navigate('TambahPerkaraScreen')}
        >
          Tambah Daftar Perkara
        </Button>

        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={hideDialog}
            style={{ backgroundColor: '#fefefe', borderRadius: 20, marginHorizontal: 20, elevation: 5 }}
          >
            <Dialog.Title
              style={{ fontSize: 20, fontWeight: 'bold', color: '#0d6efd', textAlign: 'center' }}
            >
              Ubah Agenda Sidang
            </Dialog.Title>
            <Dialog.Content style={{ paddingHorizontal: 20 }}>
              <Text style={styles.dialogLabel}>Agenda Siang Selanjutnya</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedNextAgenda}
                  onValueChange={(value) => setSelectedNextAgenda(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Pilih Agenda --" value="" />
                  <Picker.Item label="Mediasi" value="Mediasi" />
                  <Picker.Item label="Putusan" value="Putusan" />
                  <Picker.Item label="Pemeriksaan Saksi" value="Pemeriksaan Saksi" />
                </Picker>
              </View>

              <Text style={styles.dialogLabel}>Tanggal Sidang Selanjutnya</Text>
              <TextInput
                mode="outlined"
                placeholder="Pilih Tanggal"
                value={selectedDate ? selectedDate.toDateString() : ''}
                onFocus={showDateSelector}
                style={{ marginBottom: 16, backgroundColor: '#fff', borderRadius: 8 }}
                outlineColor="#ccc"
                showSoftInputOnFocus={false}
                activeOutlineColor="#0d6efd"
                right={<TextInput.Icon icon="calendar" />}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 12 }}>
              <Button onPress={hideDialog} textColor="#6c757d">
                Batal
              </Button>
              <Button
                mode="contained"
                onPress={handleUbah}
                disabled={!selectedNextAgenda || !selectedDate}
                style={{ backgroundColor: '#0d6efd', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              >
                Ubah
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subHeader: { color: '#f0f0f0', fontSize: 14, marginBottom: 12 },
  card: { borderRadius: 12, marginBottom: 16, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16, marginBottom: 8 },
  agendaSection: { paddingHorizontal: 12, paddingBottom: 12 },
  agendaTitle: { fontSize: 15, fontWeight: '600', marginTop: 8, marginBottom: 4, color: '#000' },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  itemStatus: { fontSize: 14, color: '#6c757d' },
  itemCard: { borderRadius: 12, marginBottom: 10, backgroundColor: '#fff' },
  iconGreen: { backgroundColor: '#28a745', marginRight: 12 },
  iconOrange: { backgroundColor: '#ffb347', marginRight: 12 },
  iconBlue: { backgroundColor: '#0d6efd', marginRight: 12 },
  dialogLabel: { marginTop: 8, marginBottom: 4, fontWeight: '600', fontSize: 14, color: '#333' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  picker: { height: 52, paddingHorizontal: 12 },
});