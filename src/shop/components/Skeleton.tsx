import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, useStyles } from '../theme';

// LESSON: SKELETON LOADERS
// Instead of a spinner, show grey placeholder shapes in the layout of the
// real content. The screen feels faster and doesn't "jump" when data lands.

function Pulse({ style }: { style: ViewStyle }) {
  const { styles } = useStyles(makeStyles);
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // loop: fade 0.4 -> 1 -> 0.4 forever
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop(); // cleanup when the skeleton disappears
  }, [opacity]);

  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

export function ProductSkeleton() {
  const { styles } = useStyles(makeStyles);
  return (
    <View style={styles.card} accessibilityLabel="Loading product">
      <Pulse style={styles.image} />
      <View style={styles.lines}>
        <Pulse style={styles.lineTitle} />
        <Pulse style={styles.lineCategory} />
        <Pulse style={styles.lineRating} />
        <Pulse style={styles.linePrice} />
      </View>
    </View>
  );
}

export function ProductSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    block: { backgroundColor: c.surface, borderRadius: 6 },
    card: {
      flexDirection: 'row',
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
    },
    image: { width: 96, height: 96, borderRadius: 10 },
    lines: { flex: 1, marginLeft: 12, gap: 8 },
    lineTitle: { height: 16, width: '85%' },
    lineCategory: { height: 12, width: '40%' },
    lineRating: { height: 12, width: '25%' },
    linePrice: { height: 20, width: '35%', marginTop: 'auto' },
  });
