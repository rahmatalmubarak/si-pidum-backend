import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  useTheme,
  Divider,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreenCombined() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const prayerTimes = [
    { name: 'Imsak', time: '4:44 AM', icon: 'minus-circle-outline' },
    { name: 'Fajr', time: '4:54 AM', icon: 'volume-high' },
    { name: 'Dhuhr', time: '12:23 PM', icon: 'bell-outline' },
    { name: 'Asr', time: '3:47 PM', icon: 'bell' },
    { name: 'Maghrib', time: '6:27 PM', icon: 'volume-high' },
    { name: 'Isha’a', time: '7:41 PM', icon: 'volume-high' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#198754' }}>
      <LinearGradient
        colors={['#0f5132', '#198754']}
        style={styles.flex}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          <Text style={styles.header}>Welcome back, Rahmat 👋</Text>

          {/* Location & Date */}
          <Text style={styles.subHeader}>Kecamatan Pangkalan Koto Baru</Text>
          <Text style={styles.subHeader}>Today, 29 Dhul-Hijjah 1446</Text>

          {/* Premium Banner */}
          <Card style={styles.banner}>
            <Card.Content>
              <Text style={styles.bannerText}>Go Premium ✨</Text>
            </Card.Content>
          </Card>

          {/* Prayer Time Summary */}
          <View style={styles.row}>
            <Card style={styles.smallCard}>
              <Card.Title title="Asr" subtitle="Next" right={() => <Text style={styles.arrow}>→</Text>} />
            </Card>
            <Card style={styles.smallCard}>
              <Card.Title title="Maghrib" subtitle="Upcoming" right={() => <Text style={styles.arrow}>→</Text>} />
            </Card>
          </View>

          {/* Features Section */}
          <Text style={styles.sectionTitle}>Your Features</Text>
          <View style={styles.row}>
            <Avatar.Icon size={50} icon="compass" style={styles.featureIcon} />
            <Avatar.Icon size={50} icon="hands-pray" style={styles.featureIcon} />
            <Avatar.Icon size={50} icon="counter" style={styles.featureIcon} />
            <Avatar.Icon size={50} icon="gift-outline" style={styles.featureIcon} />
            <Avatar.Icon size={50} icon="message-outline" style={styles.featureIcon} />
          </View>

          {/* Prayer Time Detail Section */}
          <Card style={styles.card}>
            <Card.Title title="Today's Prayers" />
            <Divider />
            {prayerTimes.map((item, index) => (
              <View key={index} style={styles.prayerRow}>
                <Avatar.Icon size={24} icon={item.icon} style={styles.prayerIcon} />
                <Text style={styles.prayerText}>{item.name}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.prayerTime}>{item.time}</Text>
              </View>
            ))}
          </Card>

          {/* Info Boxes */}
          <Card style={[styles.infoBox, { backgroundColor: '#d9534f' }]}>
            <Card.Content>
              <Text style={styles.infoText}>
                Set "Force Adhan Notification" if you experience delay.
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.infoBox, { backgroundColor: '#0275d8' }]}>
            <Card.Content>
              <Text style={styles.infoText}>
                Did you know? You can use Muslim Pro in Bahasa Indonesia.
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    minHeight: SCREEN_HEIGHT,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subHeader: {
    color: '#d1e7dd',
    fontSize: 14,
    marginBottom: 4,
  },
  banner: {
    backgroundColor: '#20c997',
    marginVertical: 12,
    borderRadius: 12,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  arrow: {
    fontSize: 18,
    color: '#000',
    marginRight: 10,
  },
  featureIcon: {
    marginHorizontal: 4,
    backgroundColor: '#0f5132',
  },
  card: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  prayerIcon: {
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  prayerText: {
    fontSize: 16,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 12,
    marginTop: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
});
