import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore, Task } from '../src/store/useTaskStore';
import TaskItem from '../src/components/TaskItem';

export default function TasksScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);

  const [text, setText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const resetForm = () => {
    setText('');
    setCompleted(false);
    setDueDate(null);
    setPriority('Baixa');
    setIsUpdating(false);
    setTaskId('');
    setModalVisible(false);
  };

  const updateMode = (task: Task) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setPriority(task.priority || 'Baixa');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const formattedDate = dueDate ? dueDate.toISOString() : null;

    if (isUpdating) {
      updateTask(taskId, {
        text,
        completed,
        dueDate: formattedDate,
        priority,
      });
    } else {
      const newTask: Task = {
        _id: Date.now().toString(),
        text,
        completed,
        dueDate: formattedDate,
        priority,
      };
      addTask(newTask);
    }
    resetForm();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Contador */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Total: {tasks.length} | ✅ {completedCount} | 📋 {pendingCount}
          </Text>
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={
                  filter === f
                    ? styles.filterTextActive
                    : styles.filterTextInactive
                }
              >
                {f === 'all' ? 'Todas' : f === 'completed' ? 'Concluídas' : 'Pendentes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonAdd]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>+ Nova Tarefa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => clearAllTasks()}
          >
            <Text style={styles.actionButtonText}>Excluir Todas</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Tarefas */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {tasks.length === 0
                ? 'Nenhuma tarefa ainda. Crie uma!'
                : 'Nenhuma tarefa neste filtro.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onUpdate={() => updateMode(item)}
                onDelete={() => deleteTask(item._id)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Modal de Adicionar/Editar Tarefa */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isUpdating ? 'Editar Tarefa' : 'Nova Tarefa'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome da tarefa..."
              value={text}
              maxLength={50}
              onChangeText={setText}
            />

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data limite:</Text>
              {Platform.OS === 'web' ? (
                // @ts-ignore
                <input
                  type="date"
                  value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const parts = val.split('-');
                      setDueDate(
                        new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
                      );
                    } else {
                      setDueDate(null);
                    }
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    flex: 1,
                    marginLeft: 16,
                  }}
                />
              ) : (
                <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePickerBtn}
                  >
                    <Text>
                      {dueDate ? dueDate.toLocaleDateString() : 'Selecionar Data'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Concluída:</Text>
              <Checkbox
                value={completed}
                onValueChange={setCompleted}
                color={completed ? '#000' : undefined}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Prioridade:</Text>
              <View style={styles.priorityContainer}>
                {(['Baixa', 'Média', 'Alta'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && {
                        backgroundColor:
                          p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                        borderColor:
                          p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                      },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        priority === p && styles.priorityTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={resetForm}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, !text.trim() && styles.modalSaveBtnDisabled]}
                onPress={handleSave}
                disabled={!text.trim()}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  counterContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: '#000',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtonAdd: {
    backgroundColor: '#000',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 24,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priorityContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  priorityText: {
    color: '#333',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
  },
  modalSaveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
