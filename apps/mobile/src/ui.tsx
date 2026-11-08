import type { Outcome } from '@downunder/types';
import { disclaimers, methodVisual, tokens } from '@downunder/ui';
import { usePathname, useRouter } from 'expo-router';
import React, { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export const Screen = ({
  children,
  tabs = false,
  wide = false
}: {
  children: ReactNode;
  tabs?: boolean;
  wide?: boolean;
}) => (
  <View style={styles.shell}>
    <ScrollView contentContainerStyle={[styles.screen, tabs && styles.screenTabs]} accessibilityRole="scrollbar">
      <View style={[styles.frame, wide && styles.frameWide]}>{children}</View>
    </ScrollView>
    {tabs ? <TabBar /> : null}
  </View>
);

export const Title = ({ children }: { children: ReactNode }) => (
  <Text style={styles.title} accessibilityRole="header">
    {children}
  </Text>
);

export const Body = ({ children }: { children: ReactNode }) => <Text style={styles.body}>{children}</Text>;
export const Muted = ({ children }: { children: ReactNode }) => <Text style={styles.muted}>{children}</Text>;
export const Card = ({ children }: { children: ReactNode }) => <View style={styles.card}>{children}</View>;
export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <View style={styles.eyebrowWrap}>
    <Text style={styles.eyebrow}>{children}</Text>
  </View>
);

export const BrandMark = ({ compact = false }: { compact?: boolean }) => (
  <View style={styles.brandRow}>
    <View style={[styles.mark, compact && styles.markCompact]}>
      <Text style={styles.markText}>DU</Text>
    </View>
    {compact ? <Text style={styles.brandName}>DownUnder</Text> : null}
  </View>
);

export const PrimaryButton = ({
  label,
  onPress,
  disabled
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.primary, disabled && styles.disabled, pressed && styles.pressed]}
  >
    <Text style={styles.primaryLabel}>{label}</Text>
  </Pressable>
);

export const SecondaryButton = ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}
  >
    <Text style={styles.secondaryLabel}>{label}</Text>
  </Pressable>
);

export const TextButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.textButton}>
    <Text style={styles.textButtonLabel}>{label}</Text>
  </Pressable>
);

export const Disclaimer = () => <Text style={styles.disclaimer}>{disclaimers.notMedicalAdvice}</Text>;

export const OutcomeChip = ({ outcome }: { outcome: Outcome }) => {
  const token = tokens.color.outcome[outcome];
  return (
    <View style={[styles.chip, { backgroundColor: token.bg }]} accessibilityLabel={token.label}>
      <Text style={[styles.chipIcon, { color: token.ink }]}>{token.icon}</Text>
      <Text style={[styles.chipLabel, { color: token.ink }]}>{token.label}</Text>
    </View>
  );
};

export const ProgressTrack = ({ step }: { step: 1 | 2 | 3 }) => {
  const labels = ['Identifying medication', 'Reading sources', 'Applying guidelines'];
  return (
    <View accessibilityLiveRegion="polite" style={styles.progress}>
      <View style={styles.progressRow}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={[styles.progressDot, item <= step ? styles.progressDotOn : null]} />
        ))}
      </View>
      <Body>{labels[step - 1]}…</Body>
    </View>
  );
};

export const MethodGlyph = ({ code, size = 40 }: { code: string; size?: number }) => {
  const visual = methodVisual[code] ?? { glyph: '·', short: '' };
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tokens.color.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ color: tokens.color.accentDeep, fontWeight: '800', fontSize: size < 36 ? 11 : 13 }}>{visual.glyph}</Text>
    </View>
  );
};

const TabGlyph = ({ name, color }: { name: 'home' | 'check' | 'profile' | 'ask'; color: string }) => {
  if (name === 'home') {
    return (
      <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'flex-end' }}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 11,
            borderRightWidth: 11,
            borderBottomWidth: 9,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
            marginBottom: -1
          }}
        />
        <View style={{ width: 16, height: 12, borderWidth: 2, borderTopWidth: 0, borderColor: color }} />
      </View>
    );
  }
  if (name === 'check') {
    return (
      <View style={{ width: 24, height: 24 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 2.2,
            borderColor: color,
            marginTop: 2,
            marginLeft: 2
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 9,
            height: 2.2,
            backgroundColor: color,
            borderRadius: 1,
            right: 1,
            bottom: 5,
            transform: [{ rotate: '45deg' }]
          }}
        />
      </View>
    );
  }
  if (name === 'profile') {
    return (
      <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <View style={{ width: 16, height: 9, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: color, marginTop: 2 }} />
      </View>
    );
  }
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 18, height: 13, borderRadius: 6, borderWidth: 2.2, borderColor: color }} />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 5,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          alignSelf: 'flex-start',
          marginLeft: 6,
          marginTop: -2
        }}
      />
    </View>
  );
};

export const TabBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { href: '/home', label: 'Home', icon: 'home' as const },
    { href: '/check', label: 'Check', icon: 'check' as const },
    { href: '/profile', label: 'Profile', icon: 'profile' as const },
    { href: '/ask', label: 'Ask', icon: 'ask' as const }
  ];
  return (
    <View style={styles.tabBar} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        const color = active ? tokens.color.accentDeep : tokens.color.muted;
        return (
          <Pressable
            key={tab.href}
            onPress={() => router.push(tab.href)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            style={styles.tabItem}
          >
            <TabGlyph name={tab.icon} color={color} />
            {active ? <View style={styles.tabDot} /> : <View style={styles.tabDotOff} />}
          </Pressable>
        );
      })}
    </View>
  );
};

export const MoreLinks = () => {
  const router = useRouter();
  return (
    <View style={styles.more}>
      <TextButton label="Privacy center" onPress={() => router.push('/privacy')} />
      <TextButton label="How DownUnder decides" onPress={() => router.push('/how')} />
      <TextButton label="Find a pharmacist" onPress={() => router.push('/help')} />
    </View>
  );
};

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: tokens.color.bg },
  screen: { flexGrow: 1, backgroundColor: tokens.color.bg, padding: 20 },
  screenTabs: { paddingBottom: 88 },
  frame: { width: '100%', maxWidth: 430, alignSelf: 'center', gap: 16, paddingBottom: 24 },
  frameWide: { maxWidth: 720 },
  title: {
    fontSize: tokens.type.display,
    color: tokens.color.ink,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 36
  },
  body: { fontSize: tokens.type.body, color: tokens.color.ink, lineHeight: 24 },
  muted: { fontSize: tokens.type.small, color: tokens.color.muted, lineHeight: 21 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.color.secondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  card: {
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.md,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: tokens.color.line
  },
  eyebrowWrap: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.color.surfaceMuted,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  eyebrow: { color: tokens.color.secondary, fontSize: 13, fontWeight: '600' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markCompact: { width: 32, height: 32, borderRadius: 10 },
  markText: { color: tokens.color.onAccent, fontWeight: '800', fontSize: 16, letterSpacing: 0.4 },
  brandName: { fontSize: 16, fontWeight: '700', color: tokens.color.ink },
  primary: {
    minHeight: tokens.target,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  primaryLabel: { color: tokens.color.onAccent, fontSize: 16, fontWeight: '700' },
  secondary: {
    minHeight: tokens.target,
    borderRadius: tokens.radius.pill,
    borderWidth: 1.5,
    borderColor: tokens.color.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: tokens.color.surface
  },
  secondaryLabel: { color: tokens.color.secondary, fontSize: 16, fontWeight: '700' },
  textButton: { minHeight: 44, justifyContent: 'center' },
  textButtonLabel: { color: tokens.color.accent, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.45 },
  disclaimer: { fontSize: 13, color: tokens.color.muted, lineHeight: 19 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: tokens.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start'
  },
  chipIcon: { fontSize: 16, fontWeight: '700' },
  chipLabel: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  progress: { gap: 8, paddingVertical: 4 },
  progressRow: { flexDirection: 'row', gap: 8 },
  progressDot: { flex: 1, height: 6, borderRadius: 99, backgroundColor: tokens.color.line },
  progressDotOn: { backgroundColor: tokens.color.accent },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: tokens.color.line,
    backgroundColor: tokens.color.surface,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10
  },
  tabItem: { flex: 1, alignItems: 'center', minHeight: 48, justifyContent: 'center', gap: 4 },
  tabDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: tokens.color.accent },
  tabDotOff: { width: 6, height: 6 },
  more: { gap: 4, paddingTop: 4 }
});
