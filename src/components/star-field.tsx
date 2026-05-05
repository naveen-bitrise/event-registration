import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const stars = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 3000,
  duration: Math.random() * 2000 + 1500,
}));

function Star({ x, y, size, delay, duration }: (typeof stars)[number]) {
  const opacity = useSharedValue(Math.random() * 0.5 + 0.2);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0.1, { duration }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.star, style, { left: x, top: y, width: size, height: size, borderRadius: size / 2 }]}
    />
  );
}

export function StarField() {
  return (
    <>
      {stars.map((s) => (
        <Star key={s.id} {...s} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
});
