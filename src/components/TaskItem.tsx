import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../store/useTaskStore';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        { text: 'Excluir', onPress: onDelete, style: 'destructive' },
      ]
    );
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Alta':
        return '#f44336';
      case 'Média':
        return '#ff9800';
      case 'Baixa':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.content}>
        <Text
          style={[
            styles.taskText,
            task.completed && styles.completedText,
          ]}
        >
          {task.text}
        </Text>
        
        <View style={styles.metaContainer}>
          {task.priority && (
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            >
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
          )}
          
          {task.dueDate && (
            <Text style={styles.dateText}>
              📅 {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onUpdate} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#0066cc" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash" size={20} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  completedContainer: {
    backgroundColor: '#f5f5f5',
    borderLeftColor: '#4caf50',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});

export default TaskItem;
