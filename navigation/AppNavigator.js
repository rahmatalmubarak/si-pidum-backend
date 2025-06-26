// AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- screens ---
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';   // “Today”
import PrayersScreen from '../screens/PrayersScreen';             // ganti jika ada
import TambahPerkaraScreen from '../screens/TambahPerkaraScreen';             // ganti jika ada
import DaftarPerkaraScreen from '../screens/DaftarPerkaraScreen';             // ganti jika ada


// Dummy placeholders
import { View, Text } from 'react-native';
const Dummy = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title}</Text>
  </View>
);

// ----- Bottom-Tabs -----
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#82caff', // biru muda
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarActiveTintColor: '#0d6efd',    // biru cerah
        tabBarInactiveTintColor: '#6c757d',  // abu lembut
        tabBarLabelStyle: { fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Perkara"
        component={DaftarPerkaraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gavel" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Quran"
        children={() => <Dummy title="Quran Screen" />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-page-variant" color={color} size={size} />
          ),
          tabBarBadge: 14,
        }}
      />

      <Tab.Screen
        name="Videos"
        children={() => <Dummy title="Videos Screen" />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="play-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ForYou"
        children={() => <Dummy title="For You Screen" />}
        options={{
          tabBarLabel: 'For You',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-heart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ----- Root Stack -----
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={MainTabs} />
      <Stack.Screen name="TambahPerkaraScreen" component={TambahPerkaraScreen} options={{ title: 'Tambah Perkara' }} />
    </Stack.Navigator>
  );
}
