import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { generateStory } from '@/lib/storyService';

const COSY = {
  paper: '#FFF7EC',
  paperDark: '#2A2218',
  ink: '#3B2A1F',
  inkDark: '#F4E6D0',
  accent: '#E08E45',
  accentSoft: '#F5C58A',
  shadow: 'rgba(120, 70, 20, 0.15)',
};

export default function StoryScreen() {
  const theme = useTheme();
  const isDark = theme.background === '#000000';
  const paper = isDark ? COSY.paperDark : COSY.paper;
  const ink = isDark ? COSY.inkDark : COSY.ink;

  const [input, setInput] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!input.trim()) {
      setError('Type something cosy first 🫖');
      return;
    }
    setLoading(true);
    setError(null);
    setStory(null);
    setTitles([]);
    try {
      const result = await generateStory(input.trim());
      setStory(result.story);
      setTitles(result.titles);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something fluffy went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: paper }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <ThemedText style={[styles.heading, { color: ink }]}>📖 Tiny Story Time</ThemedText>
          <ThemedText style={[styles.subheading, { color: ink }]}>
            Whisper a topic. We&apos;ll peek at Wikipedia and brew you a silly tale.
          </ThemedText>

          <ThemedView style={[styles.card, { backgroundColor: isDark ? '#3A2D1E' : '#FFF1DA' }]}>
            <ThemedText style={[styles.label, { color: ink }]}>Your prompt</ThemedText>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="e.g. grumpy hedgehog detective"
              placeholderTextColor={isDark ? '#9C8A72' : '#A98B6A'}
              style={[
                styles.input,
                {
                  color: ink,
                  backgroundColor: isDark ? '#1F1810' : '#FFFCF4',
                  borderColor: COSY.accentSoft,
                },
              ]}
              multiline
              maxLength={140}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={onGenerate}
            />

            <Pressable
              onPress={onGenerate}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: COSY.accent },
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>✨ Brew me a story</ThemedText>
              )}
            </Pressable>

            {error && (
              <ThemedView style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {story && (
            <ThemedView style={[styles.storyCard, { backgroundColor: isDark ? '#241A0F' : '#FFFCF4' }]}>
              <ThemedText style={[styles.storyHeading, { color: ink }]}>
                Once upon a search…
              </ThemedText>
              <ThemedText style={[styles.storyText, { color: ink }]}>{story}</ThemedText>

              {titles.length > 0 && (
                <>
                  <ThemedText style={[styles.ingredientsLabel, { color: ink }]}>
                    🧺 Ingredients (top 5 results):
                  </ThemedText>
                  {titles.map((t, i) => (
                    <ThemedText key={i} style={[styles.ingredient, { color: ink }]}>
                      • {t}
                    </ThemedText>
                  ))}
                </>
              )}
            </ThemedView>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    fontFamily: Fonts?.rounded,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: COSY.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  input: {
    minHeight: 80,
    borderWidth: 2,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: Fonts?.rounded,
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.7 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts?.rounded,
  },
  errorBox: {
    backgroundColor: '#FFE2D3',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  errorText: { color: '#8A2B0F', fontSize: 14 },
  storyCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: COSY.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  storyHeading: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts?.rounded,
    marginBottom: Spacing.one,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
  },
  ingredientsLabel: {
    marginTop: Spacing.three,
    fontSize: 14,
    fontWeight: '700',
  },
  ingredient: {
    fontSize: 13,
    opacity: 0.8,
  },
});
