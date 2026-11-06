import React from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../AuthContext';
import { useFavourites } from '../FavouritesContext';
import { useOrders } from '../OrdersContext';
import { Colors, useStyles } from '../theme';

export default function ProfileScreen() {
  const { styles } = useStyles(makeStyles);
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const { orders } = useOrders();

  const confirmLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (!user) {
    return null; // can't happen while signed in, but keeps TypeScript happy
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profile}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
        </View>

        <Text style={styles.section}>Order history</Text>
        {orders.length === 0 ? (
          <Text style={styles.empty}>You haven't placed any orders yet.</Text>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.order}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>
                  {new Date(order.date).toLocaleDateString()}
                </Text>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
              {order.shipping && (
                <Text style={styles.orderMeta}>
                  {order.shipping.payment} • {order.shipping.address}
                </Text>
              )}
              {order.items.map(i => (
                <Text key={i.product.id} style={styles.orderItem} numberOfLines={1}>
                  {i.qty} × {i.product.title}
                </Text>
              ))}
            </View>
          ))
        )}

        <Pressable style={styles.logout} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  content: { padding: 16, paddingBottom: 40 },
  profile: { alignItems: 'center', marginVertical: 16 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: c.primarySoft,
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: c.text },
  email: { fontSize: 14, color: c.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  stat: {
    flex: 1,
    backgroundColor: c.card,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: c.primary },
  statLabel: { fontSize: 13, color: c.textMuted, marginTop: 2 },
  section: { fontSize: 18, fontWeight: 'bold', color: c.text, marginBottom: 12 },
  empty: { color: c.textFaint, marginBottom: 12 },
  order: {
    backgroundColor: c.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderDate: { fontSize: 14, fontWeight: '600', color: c.text },
  orderTotal: { fontSize: 14, fontWeight: 'bold', color: c.primary },
  orderMeta: { fontSize: 12, color: c.textFaint, marginBottom: 6 },
  orderItem: { fontSize: 13, color: c.textMuted, marginTop: 2 },
  logout: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: c.danger,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutText: { color: c.danger, fontSize: 15, fontWeight: 'bold' },
});
