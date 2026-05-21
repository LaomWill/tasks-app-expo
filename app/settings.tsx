import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTaskStore } from '../src/store/useTaskStore';

export default function SettingsScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);

  const handleClearAll = () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja excluir todas as tarefas? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => clearAllTasks(),
          style: 'destructive',
        },
      ]
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total de Tarefas</Text>
              <Text style={styles.statValue}>{tasks.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Concluídas</Text>
              <Text style={styles.statValue}>{completedCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pendentes</Text>
              <Text style={styles.statValue}>{pendingCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAll}
            disabled={tasks.length === 0}
          >
            <Text style={styles.dangerButtonText}>Excluir Todas as Tarefas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.aboutText}>
            Gerenciador de Tarefas v1.0.0
          </Text>
          <Text style={styles.aboutText}>
            Desenvolvido com React Native e Expo
          </Text>
          <Text style={styles.aboutText}>
            Estado global gerenciado com Zustand
          </Text>
          <Text style={styles.aboutText}>
            Dados persistidos com AsyncStorage
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  dangerButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
