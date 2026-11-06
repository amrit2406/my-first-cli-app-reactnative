import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
  label?: string; // for screen readers, e.g. the product name
};

// LESSON: ANIMATION (Animated API)
// An Animated.Value is a number that can change smoothly over time.
// Here: on tap the heart grows to 1.4x, then springs back to 1x.
// useNativeDriver: true runs the animation on the native side, so it
// stays smooth even if JavaScript is busy.
export default function HeartButton({
  active,
  onPress,
  size = 22,
  label = 'item',
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        active ? `Remove ${label} from favourites` : `Add ${label} to favourites`
      }
    >
      <Animated.Text style={{ fontSize: size, transform: [{ scale }] }}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}
