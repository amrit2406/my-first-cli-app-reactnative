
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from
  'react-native-safe-area-context';

const COLORS = {
  primary: '#2563EB',
  background: '#F1F5F9',
  white: '#FFFFFF',
  heading: '#0F172A',
  text: '#64748B',
};

const stats = [
  { id: '1', title: 'Total Orders', value: '120' },
  { id: '2', title: 'Completed', value: '85' },
  { id: '3', title: 'Pending', value: '25' },
  { id: '4', title: 'Cancelled', value: '10' },
];

const activities = [
  { id: '1', title: 'New order received', time: '10:30 AM' },
  { id: '2', title: 'Payment completed', time: '11:15 AM' },
  { id: '3', title: 'Order dispatched', time: '12:00 PM' },
];

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              GOOD MORNING
            </Text>

            <Text style={styles.heading}>
              Dashboard
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>
            TOTAL REVENUE
          </Text>

          <Text style={styles.revenueAmount}>
            ₹1,25,000
          </Text>

          <Text style={styles.revenueDescription}>
            Monthly overview
          </Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          {stats.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <Text style={styles.statValue}>
                {item.value}
              </Text>

              <Text style={styles.statTitle}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.activityContainer}>
          {activities.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <Text style={styles.activityTitle}>
                {item.title}
              </Text>

              <Text style={styles.activityTime}>
                {item.time}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 12,
    color: COLORS.text,
    letterSpacing: 1,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.heading,
    marginTop: 5,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },

  revenueCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
  },

  revenueLabel: {
    fontSize: 12,
    color: '#DBEAFE',
  },

  revenueAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    marginVertical: 12,
  },

  revenueDescription: {
    fontSize: 13,
    color: '#DBEAFE',
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 14,
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.heading,
  },

  statTitle: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.heading,
    marginBottom: 14,
  },

  activityContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    gap: 18,
  },

  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  activityTitle: {
    fontSize: 13,
    color: COLORS.heading,
    flexShrink: 1,
  },

  activityTime: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 8,
  },
});
