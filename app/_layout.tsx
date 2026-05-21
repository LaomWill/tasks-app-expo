import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Minhas Tarefas',
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerTitle: 'Gerenciador de Tarefas',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          headerTitle: 'Configurações',
        }}
      />
    </Tabs>
  );
}
