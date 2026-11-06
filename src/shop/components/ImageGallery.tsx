import React, { useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Colors, useStyles } from '../theme';

type Props = {
  images: string[];
  width: number; // gallery width in px (each page is exactly this wide)
  height?: number;
};

// A swipeable image pager with dots. FlatList does the heavy lifting:
// horizontal + pagingEnabled = snaps one full page at a time.
export default function ImageGallery({ images, width, height = 280 }: Props) {
  const { styles } = useStyles(makeStyles);
  const [index, setIndex] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={[styles.wrap, { width, height }]}>
      <FlatList
        data={images}
        keyExtractor={(uri, i) => `${i}-${uri}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width, height }} resizeMode="contain" />
        )}
        accessibilityLabel={`Product images, ${index + 1} of ${images.length}`}
      />
      {images.length > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: c.surface,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
    },
    dots: {
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.textFaint,
      opacity: 0.6,
    },
    dotActive: { backgroundColor: c.primary, opacity: 1 },
  });
