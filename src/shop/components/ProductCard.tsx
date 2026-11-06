import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import HeartButton from './HeartButton';
import { useCart } from '../CartContext';
import { useFavourites } from '../FavouritesContext';
import { Product } from '../types';
import { Colors, useStyles } from '../theme';

type Props = {
  product: Product;
  onPress: (p: Product) => void;
};

// React.memo: skip re-rendering this card unless its props changed.
// Matters in long lists, where one change shouldn't redraw every row.
function ProductCard({ product, onPress }: Props) {
  const { styles } = useStyles(makeStyles);
  // Components can read global state directly, so the screens using
  // this card don't have to pass cart/favourite props down.
  const { add } = useCart();
  const { isFavourite, toggle } = useFavourites();

  return (
    <Pressable style={styles.card} onPress={() => onPress(product)}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <HeartButton
            active={isFavourite(product.id)}
            onPress={() => toggle(product)}
          />
        </View>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Pressable style={styles.addBtn} onPress={() => add(product)}>
            <Text style={styles.addBtnText}>+ Cart</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ProductCard);

const makeStyles = (c: Colors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: c.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: c.surface,
  },
  info: { flex: 1, marginLeft: 12 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: { flex: 1, fontSize: 15, fontWeight: '600', color: c.text },
  category: { fontSize: 12, color: c.textMuted, marginTop: 2 },
  rating: { fontSize: 12, color: c.warning, marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: { fontSize: 17, fontWeight: 'bold', color: c.primary },
  addBtn: {
    backgroundColor: c.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { color: c.onPrimary, fontSize: 13, fontWeight: '600' },
});
