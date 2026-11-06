import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SortKey } from '../api';
import { useAuth } from '../AuthContext';
import { useCategories, useProductsInfinite } from '../queries';
import ProductCard from '../components/ProductCard';
import { Product, RootStackParamList, TabParamList } from '../types';
import { Colors, useStyles } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Shop'>,
  NativeStackScreenProps<RootStackParamList>
>;

const prettify = (slug: string) => slug.replace(/-/g, ' ');

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Featured' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
  { key: 'rating', label: 'Top rated' },
];

export default function ProductListScreen({ navigation }: Props) {
  const { styles, colors } = useStyles(makeStyles);
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('default');

  // LESSON: no manual fetching code any more. Query gives us the state.
  const query = useProductsInfinite(debounced, category, sort);
  const categories = useCategories().data ?? [];

  // `data.pages` is an array of pages; flatten them into one list.
  const products = useMemo(
    () => query.data?.pages.flatMap(page => page.products) ?? [],
    [query.data],
  );

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  // DEBOUNCE: wait until the user stops typing for 400ms.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // The API can't combine search + category, so choosing one clears the other.
  const onChangeSearch = (text: string) => {
    setSearch(text);
    if (text) {
      setCategory(null);
    }
  };
  const onSelectCategory = (c: string | null) => {
    setCategory(c);
    setSearch('');
    setDebounced('');
  };

  const openDetail = useCallback(
    (product: Product) => navigation.navigate('Detail', { product }),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.hello}>Hello, {user?.firstName} 👋</Text>
      <Text style={styles.heading}>Shop</Text>

      <TextInput
        style={styles.search}
        placeholder="Search products..."
        placeholderTextColor={colors.textFaint}
        value={search}
        onChangeText={onChangeSearch}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {/* Horizontal chips */}
      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          keyboardShouldPersistTaps="handled"
        >
          {[null, ...categories].map(c => {
            const active = c === category;
            return (
              <Pressable
                key={c ?? 'all'}
                onPress={() => onSelectCategory(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c ? prettify(c) : 'all'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort options */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORTS.map(o => (
          <Pressable key={o.key} onPress={() => setSort(o.key)}>
            <Text style={[styles.sortOption, sort === o.key && styles.sortActive]}>
              {o.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* THREE UI STATES of any network screen: loading / error / data */}
      {query.isPending ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.center} />
      ) : query.isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠ {query.error.message}</Text>
          <Pressable style={styles.retryBtn} onPress={() => query.refetch()}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={p => String(p.id)}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={openDetail} />
          )}
          contentContainerStyle={styles.list}
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
          // INFINITE SCROLL: fires when within 50% of the list end
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footer} />
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>No products found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, paddingHorizontal: 16 },
  hello: { fontSize: 14, color: c.textMuted, marginTop: 12 },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: c.text,
    marginBottom: 12,
  },
  search: {
    backgroundColor: c.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: c.text,
    marginBottom: 12,
  },
  chipsWrap: { height: 40, marginBottom: 12 },
  chips: { gap: 8, alignItems: 'center' },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: c.surface,
  },
  chipActive: { backgroundColor: c.primary },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.textSubtle,
    textTransform: 'capitalize',
  },
  chipTextActive: { color: c.onPrimary },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  sortLabel: { fontSize: 13, color: c.textFaint },
  sortOption: { fontSize: 13, color: c.textMuted },
  sortActive: { color: c.primary, fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  footer: { marginVertical: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: c.danger, fontSize: 15, marginBottom: 12 },
  retryBtn: {
    backgroundColor: c.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: c.onPrimary, fontWeight: '600' },
  empty: { textAlign: 'center', color: c.textFaint, marginTop: 40 },
});
