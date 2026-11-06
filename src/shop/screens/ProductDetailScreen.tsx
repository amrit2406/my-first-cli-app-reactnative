import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../CartContext';
import { useFavourites } from '../FavouritesContext';
import HeartButton from '../components/HeartButton';
import { RootStackParamList } from '../types';
import { Colors, useStyles } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { styles } = useStyles(makeStyles);
  // `route.params` is the data passed in navigation.navigate('Detail', {...})
  const { product } = route.params;
  const { add, items } = useCart();
  const { isFavourite, toggle } = useFavourites();

  const inCart = items.find(i => i.product.id === product.id)?.qty ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <HeartButton
            size={28}
            active={isFavourite(product.id)}
            onPress={() => toggle(product)}
          />
        </View>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={() => add(product)}>
          <Text style={styles.buttonText}>
            Add to cart{inCart > 0 ? ` (${inCart} in cart)` : ''}
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Keep shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.card },
  content: { padding: 20 },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: c.surface,
    marginBottom: 20,
  },
  category: { fontSize: 12, color: c.textMuted, letterSpacing: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 6,
  },
  title: { flex: 1, fontSize: 24, fontWeight: 'bold', color: c.text },
  rating: { fontSize: 14, color: c.warning, marginTop: 6 },
  price: { fontSize: 28, fontWeight: 'bold', color: c.primary, marginVertical: 12 },
  description: { fontSize: 15, lineHeight: 22, color: c.textSubtle },
  footer: { padding: 20, gap: 12, alignItems: 'center' },
  button: {
    backgroundColor: c.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: { color: c.onPrimary, fontSize: 16, fontWeight: 'bold' },
  back: { color: c.textMuted, fontSize: 14 },
});
