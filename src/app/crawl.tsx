import { Audio } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const STAR_WAR_YELLOW = '#FFE81F';
const CRAWL_DURATION_MS = 90000;

const CRAWL_TEXT = `It is a period of civil war.
Rebel spaceships, striking
from a hidden base, have won
their first victory against
the evil Galactic Empire.

During the battle, Rebel
spies managed to steal secret
plans to the Empire's ultimate
weapon, the DEATH STAR,
an armored space station with
enough power to destroy
an entire planet.

Pursued by the Empire's
sinister agents, Princess
Leia races home aboard her
starship, custodian of the
stolen plans that can save
her people and restore
freedom to the galaxy....`;

export default function CrawlScreen() {
  const translateY = useSharedValue(height);
  const introOpacity = useSharedValue(0);
  const introScale = useSharedValue(1.4);
  const crawlOpacity = useSharedValue(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Play music
    (async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/star-wars-theme.mp3'),
        { isLooping: false, volume: 1.0 },
      );
      soundRef.current = sound;
      await sound.playAsync();
    })();

    // "A long time ago..." fade in then out
    introOpacity.value = withTiming(1, { duration: 1500 });
    introScale.value = withTiming(1, { duration: 1500 });

    const timeout = setTimeout(() => {
      introOpacity.value = withTiming(0, { duration: 1500 }, () => {
        crawlOpacity.value = withTiming(1, { duration: 500 });
        translateY.value = withTiming(-height * 3, {
          duration: CRAWL_DURATION_MS,
          easing: Easing.linear,
        });
      });
    }, 4000);

    return () => {
      clearTimeout(timeout);
      soundRef.current?.unloadAsync();
    };
  }, []);

  const introStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [{ scale: introScale.value }],
  }));

  const crawlContainerStyle = useAnimatedStyle(() => ({
    opacity: crawlOpacity.value,
  }));

  const crawlStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable style={styles.screen} onPress={() => router.back()}>
      {/* Intro text */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, introStyle]}>
        <Text style={styles.introText}>A long time ago in a galaxy</Text>
        <Text style={styles.introText}>far, far away....</Text>
      </Animated.View>

      {/* Crawl */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.crawlWrapper, crawlContainerStyle]}>
        <View style={styles.perspective}>
          <Animated.View style={[styles.crawl, crawlStyle]}>
            <Text style={styles.episodeLabel}>Episode IV</Text>
            <Text style={styles.episodeTitle}>A NEW HOPE</Text>
            <Text style={styles.crawlBody}>{CRAWL_TEXT}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      <Text style={styles.backHint}>tap to go back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    color: STAR_WAR_YELLOW,
    fontSize: 22,
    fontFamily: 'serif',
    letterSpacing: 1,
    textAlign: 'center',
  },
  crawlWrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  perspective: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'flex-end',
    transform: [{ perspective: 250 }, { rotateX: '22deg' }],
  },
  crawl: {
    width: width * 0.72,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
  },
  episodeLabel: {
    color: STAR_WAR_YELLOW,
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
  },
  episodeTitle: {
    color: STAR_WAR_YELLOW,
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 24,
  },
  crawlBody: {
    color: STAR_WAR_YELLOW,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  backHint: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.3,
  },
});
