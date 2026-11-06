import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

// LESSON: PROPS
// Props are the "inputs" of a component, like function arguments.
// The parent (TodoApp) passes data DOWN, and passes functions down
// so the child can tell the parent "something happened".
export type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: string) => void; // called when the task is tapped
  onDelete: (id: string) => void; // called when ✕ is tapped
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      {/* Pressable = anything you can tap. Replaces <button> / onClick. */}
      <Pressable style={styles.left} onPress={() => onToggle(task.id)}>
        <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
          {task.done && <Text style={styles.tick}>✓</Text>}
        </View>

        {/* Style arrays: later styles override earlier ones. */}
        <Text style={[styles.title, task.done && styles.titleDone]}>
          {task.title}
        </Text>
      </Pressable>

      <Pressable onPress={() => onDelete(task.id)} hitSlop={10}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#2563EB',
  },
  tick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    color: '#0F172A',
    flexShrink: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  delete: {
    fontSize: 18,
    color: '#EF4444',
    paddingLeft: 12,
  },
});
