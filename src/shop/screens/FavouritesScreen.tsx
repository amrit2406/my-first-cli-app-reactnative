import React, { useCallback } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFavourites } from '../FavouritesContext';
import ProductCard from '../components/ProductCard';
import { Product, RootStackParamList, TabParamList } from '../types';
import { Colors, useStyles } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Favourites'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function FavouritesScreen({ navigation }: Props) {
  const { styles } = useStyles(makeStyles);
  const { favourites } = useFavourites();

  const openDetail = useCallback(
    (product: Product) => navigation.navigate('Detail', { product }),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Favourites</Text>
      <FlatList
        data={favourites}
        keyExtractor={p => String(p.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={openDetail} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No favourites yet.{'\n'}Tap the 🤍 on any product.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, paddingHorizontal: 16 },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: c.text,
    marginVertical: 16,
  },
  list: { paddingBottom: 20 },
  empty: {
    textAlign: 'center',
    color: c.textFaint,
    marginTop: 60,
    fontSize: 16,
    lineHeight: 24,
  },
});
