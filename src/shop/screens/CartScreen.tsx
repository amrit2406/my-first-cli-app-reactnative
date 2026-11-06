import React from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../CartContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, useStyles } from '../theme';

export default function CartScreen() {
  const { styles } = useStyles(makeStyles);
  const { items, totalPrice, add, decrease, remove } = useCart();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Checkout is now its own screen with a validated form.
  const checkout = () => navigation.navigate('Checkout');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Your Cart</Text>

      <FlatList
        data={items}
        keyExtractor={i => String(i.product.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty 🛒</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.product.thumbnail }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.price}>
                ${(item.product.price * item.qty).toFixed(2)}
              </Text>
              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyBtn} onPress={() => decrease(item.product.id)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qty}>{item.qty}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => add(item.product)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => remove(item.product.id)} hitSlop={10}>
              <Text style={styles.remove}>✕</Text>
            </Pressable>
          </View>
        )}
      />

      {/* Only show the checkout bar when there is something in the cart */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.checkout} onPress={checkout}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: c.text,
    margin: 16,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  empty: { textAlign: 'center', color: c.textFaint, marginTop: 60, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  image: { width: 70, height: 70, borderRadius: 10, backgroundColor: c.surface },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '600', color: c.text },
  price: { fontSize: 15, color: c.primary, fontWeight: 'bold', marginVertical: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, color: c.text, lineHeight: 22 },
  qty: { fontSize: 15, fontWeight: '600', color: c.text },
  remove: { fontSize: 18, color: c.danger, paddingLeft: 8 },
  footer: {
    backgroundColor: c.card,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16, color: c.textMuted },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: c.text },
  checkout: {
    backgroundColor: c.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: { color: c.onPrimary, fontSize: 16, fontWeight: 'bold' },
});
