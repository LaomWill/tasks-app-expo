import React, { useMemo } from 'react';
import { SectionList, Text, StyleSheet, View } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskType[];
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  const sections = useMemo(() => {
    const completed = tasks.filter(t => !!t.completed);
    const pending = tasks.filter(t => !t.completed);

    return [
      { title: '📋 Pendentes', data: pending },
      { title: '✅ Concluídas', data: completed },
    ];
  }, [tasks]);

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            updateMode={() => onUpdate(item)} 
            deleteTask={() => onDelete(item._id)} 
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        )}
        renderSectionFooter={({ section }) => {
          if (section.data.length === 0) {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma tarefa nesta categoria.</Text>
              </View>
            );
          }
          return null;
        }}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
});

export default TaskList;
