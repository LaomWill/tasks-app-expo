import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'Baixa' | 'Média' | 'Alta';
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  clearAllTasks: () => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,

      setTasks: (tasks) => set({ tasks }),
      setLoading: (loading) => set({ loading }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task],
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? { ...task, ...updates } : task
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      })),

      toggleTaskCompleted: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        ),
      })),

      clearAllTasks: () => set({ tasks: [] }),

      getTaskById: (id) => {
        const { tasks } = get();
        return tasks.find((task) => task._id === id);
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
