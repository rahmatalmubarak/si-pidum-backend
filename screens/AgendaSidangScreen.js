import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import {
    Text,
    Card,
    Avatar,
    FAB,
    Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ---------------- DUMMY DATA ---------------- */
const initialPerkaraList = [
    { id: 1, namaTersangka: 'Ahmad Santoso', jenisPerkara: 'Perkara Tanah', tahap: 'limpah', sidang: "2025-12-12" },
    { id: 2, namaTersangka: 'Budi Setiawan', jenisPerkara: 'Perkara Waris', tahap: 'penuntutan', sidang: "2025-12-12" },
    { id: 3, namaTersangka: 'Citra Dewi', jenisPerkara: 'Perkara Perdata', tahap: 'limpah', sidang: "2025-12-12" },
    { id: 4, namaTersangka: 'Doni Prasetyo', jenisPerkara: 'Perkara Pidana', tahap: 'putusan', sidang: "2025-12-12" },
];

export default function AgendaSidangScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [perkaraList, setPerkaraList] = useState(initialPerkaraList);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // 👉 Simulasikan fetch API
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    return (
        <LinearGradient colors={["#56c596", "#82caff"]} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0d6efd"]} />}
            >
                {/* ---------- Header ---------- */}
                <Text style={styles.header}>Agenda Sidang</Text>

                {/* ---------- List ---------- */}
                {perkaraList.map(item => {
                    const isDone = item.tahap === 'Putusan';
                    const iconColor = isDone ? '#28a745' : '#ffc107';
                    const chipColor = isDone ? '#d1e7dd' : '#fff3cd';
                    const chipText = isDone ? '#0f5132' : '#664d03';
                    return (
                        <Card key={item.id} style={styles.itemCard}>
                            <View style={styles.itemRow}>
                                <Avatar.Icon size={40} icon="gavel" style={[styles.iconBlue, { backgroundColor: iconColor }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>{item.namaTersangka}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Chip style={[styles.statusChip, { backgroundColor: chipColor }]} textStyle={{ color: chipText }}>
                                            {item.tahap}
                                        </Chip>
                                    </View>
                                    <Text style={[styles.itemTitle, { marginTop: 10 }]}>Sidang Tanggal : {item.sidang}</Text>
                                </View>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>

            {/* ---------- Floating Action Button ---------- */}
            <FAB
                icon="plus"
                style={[styles.fab, { bottom: insets.bottom }]}
                color="#fff"
                onPress={() => navigation.navigate('TambahPerkara')}
            />
        </LinearGradient>
    );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 12,
        elevation: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    statusChip: {
        alignSelf: 'flex-start',
    },
    iconBlue: {
        marginRight: 14,
    },
    fab: {
        position: 'absolute',
        right: 24,
        backgroundColor: '#0d6efd',
        elevation: 6,
    },
});
