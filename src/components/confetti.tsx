import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

const COLORS = [
  '#3C9FFE', '#0274DF',
  '#FF6B6B', '#FFE66D', '#4ECDC4',
  '#A8E6CF', '#FF8B94', '#C3B1E1',
  '#FFD93D', '#6BCB77',
];

type ParticleData = {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  targetRotation: number;
  drift: number;
  isCircle: boolean;
};

function createParticles(): ParticleData[] {
  return Array.from({ length: 60 }, (_, id) => ({
    id,
    x: Math.random() * W,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 600,
    duration: 1800 + Math.random() * 1200,
    targetRotation: 360 * (2 + Math.floor(Math.random() * 4)) * (Math.random() > 0.5 ? 1 : -1),
    drift: (Math.random() - 0.5) * 120,
    isCircle: Math.random() > 0.4,
  }));
}

function Particle({ x, color, size, delay, duration, targetRotation, drift, isCircle }: ParticleData) {
  const translateY = useSharedValue(-size);
  const translateX = useSharedValue(x);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 80 }));
    translateY.value = withDelay(
      delay,
      withTiming(H + size + 20, { duration, easing: Easing.in(Easing.quad) }),
    );
    translateX.value = withDelay(
      delay,
      withTiming(x + drift, { duration, easing: Easing.inOut(Easing.sin) }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(targetRotation, { duration, easing: Easing.linear }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { width: size, height: size, backgroundColor: color, borderRadius: isCircle ? size / 2 : 2 },
        style,
      ]}
    />
  );
}

export function Confetti() {
  const particles = useRef(createParticles()).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute', top: 0, left: 0 },
});
