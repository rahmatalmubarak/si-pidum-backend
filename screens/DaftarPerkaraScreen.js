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
    IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const initialPerkaraList = [
    { id: 1, namaTersangka: 'Ahmad Santoso', jenisPerkara: 'Perkara Tanah', tahap: 'pra penuntutan', sidang: "2025-12-12" },
    { id: 2, namaTersangka: 'Budi Setiawan', jenisPerkara: 'Perkara Waris', tahap: 'penuntutan', sidang: "2025-12-12" },
    { id: 3, namaTersangka: 'Citra Dewi', jenisPerkara: 'Perkara Perdata', tahap: 'limpah', sidang: "2025-12-12" },
    { id: 4, namaTersangka: 'Doni Prasetyo', jenisPerkara: 'Perkara Pidana', tahap: 'putusan', sidang: "2025-12-12" },
];

export default function DaftarPerkaraScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [perkaraList, setPerkaraList] = useState(initialPerkaraList);
    const [refreshing, setRefreshing] = useState(false);
    const [filterTahap, setFilterTahap] = useState(null); // null = semua

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const filteredList = filterTahap
        ? perkaraList.filter(item => item.tahap.toLowerCase() === filterTahap)
        : perkaraList;

    return (
        <LinearGradient colors={["#56c596", "#82caff"]} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0d6efd"]} />}
            >
                <Text style={styles.header}>Daftar Perkara</Text>

                {/* Filter Chips - Horizontal Bar */}
                <View style={styles.filterWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                        {['Semua', 'Penuntutan', 'Pra Penuntutan'].map((label, index) => {
                            const tahapValue = label === 'Semua' ? null : label.toLowerCase();
                            const isSelected = filterTahap === tahapValue;

                            return (
                                <Chip
                                    key={index}
                                    mode="outlined"
                                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                                    textStyle={{
                                        color: isSelected ? '#fff' : '#0f5132',
                                        fontWeight: '600',
                                    }}
                                    onPress={() => setFilterTahap(tahapValue)}
                                    selected={isSelected}
                                    selectedColor="#fff"
                                >
                                    {label}
                                </Chip>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Perkara List */}
                {filteredList.map(item => {
                    const isDone = item.tahap.toLowerCase() === 'putusan';
                    const iconColor = isDone ? '#28a745' : '#ffc107';
                    const chipColor = isDone ? '#d1e7dd' : '#fff3cd';
                    const chipText = isDone ? '#0f5132' : '#664d03';

                    return (
                        <Card key={item.id} style={styles.itemCard}>
                            <View style={styles.itemRow}>
                                <Avatar.Icon size={40} icon="gavel" style={[styles.iconBlue, { backgroundColor: iconColor }]} />
                                <View style={{ flex: 1 }}>
                                    <View style={styles.rowBetween}>
                                        <View>
                                            <Text style={styles.itemTitle}>{item.namaTersangka}</Text>
                                            <Chip
                                                style={[styles.statusChip, { backgroundColor: chipColor }]}
                                                textStyle={{ color: chipText }}
                                            >
                                                {item.tahap}
                                            </Chip>
                                            <Text style={styles.sidangText}>Sidang: {item.sidang}</Text>
                                        </View>
                                        <View style={styles.iconButtons}>
                                            <IconButton
                                                iconColor="#0d6efd"
                                                icon="eye"
                                                size={20}
                                                style={{ marginRight: -6 }}
                                                onPress={() => navigation.navigate('DetailPerkara', { id: item.id })}
                                            />
                                            <IconButton
                                                iconColor="#fd7e14"
                                                icon="pencil"
                                                size={20}
                                                onPress={() => navigation.navigate('EditPerkara', { id: item.id })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>

            <FAB
                icon="plus"
                style={[styles.fab, { bottom: insets.bottom }]}
                color="#fff"
                onPress={() => navigation.navigate('TambahPerkara')}
            />
        </LinearGradient>
    );
}

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
        marginBottom: 16,
        textAlign: 'center',
    },
    filterWrapper: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
    },
    filterChip: {
        marginHorizontal: 4,
        paddingVertical: 4,
        backgroundColor: '#d1e7dd',
        borderColor: '#0f5132',
        borderWidth: 1,
        borderRadius: 20,
    },
    filterChipActive: {
        backgroundColor: '#0f5132',
        borderColor: '#0f5132',
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 12,
        elevation: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    sidangText: {
        fontSize: 13,
        marginTop: 8,
        color: '#333',
    },
    statusChip: {
        alignSelf: 'flex-start',
    },
    iconBlue: {
        marginRight: 14,
        marginTop: 4,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        right: 24,
        backgroundColor: '#0d6efd',
        elevation: 6,
    },
});
