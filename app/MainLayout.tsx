import { Drawer } from 'expo-router/drawer';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importation des pages
import Dashboard from './screens/Dashboard';
import TemperatureCheck from './screens/TemperatureCheck';
import ProductDLCCheck from './screens/ProductDLCCheck';
import CleaningCheck from './screens/CleaningCheck';

const DrawerNav = createDrawerNavigator();

export default function MainLayout() {
  return (
      <DrawerNav.Navigator
        screenOptions={{
          drawerStyle: { backgroundColor: '#0F172A', width: 250 },
          drawerLabelStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#1E293B' },
          headerTintColor: 'white',
        }}
      >
        <DrawerNav.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Tableau de bord',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color="white" />
            ),
          }}
        />
        <DrawerNav.Screen
          name="TemperatureCheck"
          component={TemperatureCheck}
          options={{
            title: 'Contrôle Température',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="thermometer" size={size} color="white" />
            ),
          }}
        />
        <DrawerNav.Screen
          name="ProductDLCCheck"
          component={ProductDLCCheck}
          options={{
            title: 'Suivi DLC Produits',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color="white" />
            ),
          }}
        />
        <DrawerNav.Screen
          name="CleaningCheck"
          component={CleaningCheck}
          options={{
            title: 'Plan Nettoyage',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="water" size={size} color="white" />
            ),
          }}
        />
      </DrawerNav.Navigator>
  );
}
