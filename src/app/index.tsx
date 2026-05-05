import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 120;
const STAR_WAR_YELLOW = '#FFE81F';

const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
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
      style={[
        styles.star,
        style,
        { left: x, top: y, width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

export default function HomeScreen() {
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.6);
  const hintOpacity = useSharedValue(0);

  useEffect(() => {
    textOpacity.value = withDelay(600, withTiming(1, { duration: 2000 }));
    textScale.value = withDelay(600, withTiming(1, { duration: 2000 }));
    hintOpacity.value = withDelay(3000, withTiming(1, { duration: 1500 }));
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));

  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }));

  return (
    <Pressable style={styles.container} onPress={() => router.push('/crawl')}>
      {stars.map((s) => (
        <Star key={s.id} {...s} />
      ))}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.text}>MAY THE 4TH</Text>
        <Text style={styles.text}>BE WITH YOU</Text>
      </Animated.View>
      <Animated.Text style={[styles.hint, hintStyle]}>tap to begin</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: STAR_WAR_YELLOW,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
    fontFamily: 'serif',
    textShadowColor: STAR_WAR_YELLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  hint: {
    color: '#ffffff',
    fontSize: 13,
    letterSpacing: 3,
    textAlign: 'center',
    opacity: 0.5,
    paddingBottom: 48,
    textTransform: 'uppercase',
  },
});
