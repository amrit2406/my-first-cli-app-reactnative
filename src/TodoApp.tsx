import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskItem, { Task } from './components/TaskItem';

type Filter = 'all' | 'active' | 'done';

export default function TodoApp() {
  // LESSON: STATE (useState)
  // Normal variables don't make the screen update. State does.
  // const [value, setValue] = useState(initialValue)
  // Calling setValue(newValue) re-runs this function and redraws the UI.
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Learn components', done: true },
    { id: '2', title: 'Learn state', done: false },
    { id: '3', title: 'Build my first app', done: false },
  ]);
  const [text, setText] = useState(''); // what's typed in the input
  const [filter, setFilter] = useState<Filter>('all');

  // NEVER change state directly (tasks.push(...) won't work).
  // Always build a NEW array/object and pass it to the setter.
  const addTask = () => {
    const title = text.trim();
    if (title === '') {
      return; // ignore empty input
    }
    const newTask: Task = { id: Date.now().toString(), title, done: false };
    setTasks([newTask, ...tasks]); // new task first, then the old ones
    setText(''); // clear the input
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // DERIVED DATA: calculated from state on every render, not stored.
  const visibleTasks = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });
  const remaining = tasks.filter(t => !t.done).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.heading}>My Tasks</Text>
      <Text style={styles.subheading}>{remaining} remaining</Text>

      {/* INPUT ROW */}
      <View style={styles.inputRow}>
        {/* "Controlled input": value comes from state, and every
            keystroke updates state through onChangeText. */}
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#94A3B8"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTask} // keyboard "enter" key
          returnKeyType="done"
        />
        <Pressable
          onPress={addTask}
          // Pressable gives you `pressed`, so you can style the touch.
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filters}>
        {(['all', 'active', 'done'] as Filter[]).map(f => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
          >
            <Text
              style={[styles.chipText, filter === f && styles.chipTextActive]}
            >
              {f.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LESSON: FlatList
          Like ScrollView + map, but only renders rows on screen,
          so it stays fast with thousands of items. */}
      <FlatList
        data={visibleTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        // Shown when the list is empty (conditional UI)
        ListEmptyComponent={
          <Text style={styles.empty}>Nothing here. Add a task above!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 16,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 30,
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 40,
  },
});
