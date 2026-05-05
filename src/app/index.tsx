import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { StarField } from '@/components/star-field';

const STAR_WAR_YELLOW = '#FFE81F';

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
      <StarField />
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
