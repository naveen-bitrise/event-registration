import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti } from '@/components/confetti';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Step = 'name' | 'team' | 'role' | 'success';
const FLOW: Step[] = ['name', 'team', 'role', 'success'];

const TEAMS = ['Build Services', 'Mobile', 'Frontend', 'Backend', 'Platform', 'Product'];
const ROLES = ['Engineer', 'Eng Manager', 'Designer', 'Prod Manager', 'DevRel', 'QA'];

// ─── Step dots ───────────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  const theme = useTheme();
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }, (_, i) => (
        <Animated.View
          key={i}
          layout={FadeIn}
          style={[
            dotStyles.dot,
            {
              backgroundColor: i <= current ? theme.text : theme.backgroundElement,
              width: i === current ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  dot: { height: 8, borderRadius: 4 },
});

// ─── Selectable card ─────────────────────────────────────────────────────────

function SelectCard({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        cardStyles.card,
        {
          backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement,
          borderColor: selected ? theme.text : 'transparent',
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <ThemedText type="small" style={selected ? cardStyles.selectedText : undefined}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1.5,
  },
  selectedText: { fontWeight: '700' },
});

// ─── Name step ───────────────────────────────────────────────────────────────

function NameStep({ name, onChange }: { name: string; onChange: (v: string) => void }) {
  const theme = useTheme();
  return (
    <View style={stepStyles.wrapper}>
      <ThemedText type="title" style={stepStyles.heading}>
        {"What's your name?"}
      </ThemedText>
      <TextInput
        autoFocus
        value={name}
        onChangeText={onChange}
        placeholder="e.g. Ada Lovelace"
        placeholderTextColor={theme.textSecondary}
        returnKeyType="next"
        style={[stepStyles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
      />
    </View>
  );
}

// ─── Grid selection step ─────────────────────────────────────────────────────

function GridStep({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const rows: string[][] = [];
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2));

  return (
    <View style={stepStyles.wrapper}>
      <ThemedText type="title" style={stepStyles.heading}>
        {title}
      </ThemedText>
      <View style={{ gap: Spacing.two }}>
        {rows.map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: Spacing.two }}>
            {row.map((opt) => (
              <SelectCard
                key={opt}
                label={opt}
                selected={selected === opt}
                onPress={() => onSelect(opt)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Success step ────────────────────────────────────────────────────────────

function SuccessStep({ name, team, role }: { name: string; team: string; role: string }) {
  return (
    <Animated.View entering={ZoomIn.delay(150).duration(400)} style={successStyles.wrapper}>
      <ThemedText style={successStyles.emoji}>🎉</ThemedText>
      <ThemedText type="title" style={{ textAlign: 'center' }}>
        {"You're in!"}
      </ThemedText>
      <ThemedView type="backgroundElement" style={successStyles.badge}>
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          {name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {team} · {role}
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const successStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  emoji: { fontSize: 72, lineHeight: 80, textAlign: 'center' },
  badge: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
});

const stepStyles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: 'center', gap: Spacing.four },
  heading: { textAlign: 'center' },
  input: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 18,
    fontWeight: '500',
  },
});

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function RegistrationScreen() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');
  const theme = useTheme();

  const stepIndex = FLOW.indexOf(step);

  function advance() {
    if (stepIndex < FLOW.length - 1) setStep(FLOW[stepIndex + 1]);
  }

  const canAdvance =
    (step === 'name' && name.trim().length > 1) ||
    (step === 'team' && team !== '') ||
    (step === 'role' && role !== '');

  return (
    <ThemedView style={styles.root}>
      {step === 'success' && <Confetti />}

      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.center}>
            <View style={[styles.content, { maxWidth: MaxContentWidth }]}>
              {step !== 'success' && (
                <StepDots current={stepIndex} total={FLOW.length - 1} />
              )}

              <View style={styles.stepOuter}>
                <Animated.View
                  key={step}
                  style={StyleSheet.absoluteFill}
                  entering={SlideInRight.duration(260)}
                  exiting={SlideOutLeft.duration(260)}>
                  {step === 'name' && <NameStep name={name} onChange={setName} />}
                  {step === 'team' && (
                    <GridStep
                      title="Pick your team"
                      options={TEAMS}
                      selected={team}
                      onSelect={setTeam}
                    />
                  )}
                  {step === 'role' && (
                    <GridStep
                      title="What's your role?"
                      options={ROLES}
                      selected={role}
                      onSelect={setRole}
                    />
                  )}
                  {step === 'success' && (
                    <SuccessStep name={name} team={team} role={role} />
                  )}
                </Animated.View>
              </View>

              {step !== 'success' && (
                <Pressable
                  onPress={advance}
                  disabled={!canAdvance}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: canAdvance ? theme.text : theme.backgroundElement,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <ThemedText
                    style={[
                      styles.buttonLabel,
                      { color: canAdvance ? theme.background : theme.textSecondary },
                    ]}>
                    {step === 'role' ? 'Register 🚀' : 'Next →'}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center' },
  content: { flex: 1, width: '100%', paddingHorizontal: Spacing.three },
  stepOuter: { flex: 1 },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  buttonLabel: { fontSize: 18, fontWeight: '600' },
});
