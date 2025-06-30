import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
    Linking,
} from 'react-native';
import {
    Text,
    Card,
    List,
    Button,
    Divider,
    Avatar,        // ⬅️ tambahkan Avatar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PengaturanScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleLogout = () => {
        Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin logout?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => navigation.navigate('Login'),
            },
        ]);
    };

    const handleReportProblem = () => {
        Alert.alert(
            'Laporkan Masalah',
            'Kirim email ke support@pengadilanapp.com',
            [
                {
                    text: 'Kirim Email',
                    onPress: () => Linking.openURL('mailto:support@pengadilanapp.com'),
                },
                { text: 'Batal', style: 'cancel' },
            ]
        );
    };

    const handleHelp = () => {
        Alert.alert(
            'Bantuan',
            'Untuk bantuan, kunjungi dokumentasi atau hubungi admin.'
        );
    };

    return (
        <LinearGradient colors={['#56c596', '#82caff']} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingTop: insets.top + 16 },
                ]}
            >

                <Text style={styles.header}>Pengaturan</Text>
                {/* Avatar dan nama pengguna */}
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={88}
                        // ganti uri berikut dengan foto user atau require('path/to/image.png')
                        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                    />
                    <Text style={styles.username}>Ahmad Santoso</Text>
                </View>

                {/* Tema */}
                <Card style={styles.card}>
                    <List.Item
                        title="Mode Gelap"
                        description="Aktifkan tema gelap"
                        left={() => (
                            <MaterialCommunityIcons
                                name="theme-light-dark"
                                size={28}
                                color="#0d6efd"
                            />
                        )}
                        right={() => (
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#ccc', true: '#0d6efd' }}
                                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                            />
                        )}
                    />
                </Card>

                {/* Info Aplikasi */}
                <Card style={styles.card}>
                    <List.Item
                        title="Tentang Aplikasi"
                        description="Sistem Manajemen Perkara Digital"
                        left={() => (
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={28}
                                color="#0d6efd"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Credit"
                        description="Dikembangkan oleh Tim Developer Hebat"
                        left={() => (
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={28}
                                color="#0d6efd"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Versi Aplikasi"
                        description="v1.0.0"
                        left={() => (
                            <MaterialCommunityIcons name="tag" size={28} color="#0d6efd" />
                        )}
                    />
                </Card>

                {/* Bantuan & Laporkan Masalah */}
                <Card style={styles.card}>
                    <List.Item
                        title="Bantuan"
                        description="Lihat dokumentasi atau panduan"
                        onPress={handleHelp}
                        left={() => (
                            <MaterialCommunityIcons
                                name="lifebuoy"
                                size={28}
                                color="#0d6efd"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Laporkan Masalah"
                        description="Hubungi tim dukungan teknis"
                        onPress={handleReportProblem}
                        left={() => (
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={28}
                                color="#0d6efd"
                            />
                        )}
                    />
                </Card>

                {/* Logout */}
                <Button
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons
                            name="logout"
                            color="#fff"
                            size={22}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    mode="contained"
                    style={styles.logoutButton}
                    labelStyle={{ fontWeight: '600', fontSize: 16 }}
                    onPress={handleLogout}
                >
                    Logout
                </Button>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    username: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        overflow: 'hidden',
        paddingHorizontal: 15,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        borderRadius: 12,
        paddingVertical: 10,
        marginTop: 8,
    },
});
