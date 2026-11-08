import { tokens, whatWeStore } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useSession } from '../src/session';
import { Body, Card, Muted, PrimaryButton, Screen, Title } from '../src/ui';

export default function Consent() {
  const router = useRouter();
  const { api, refreshConsent, path } = useSession();
  const [mode, setMode] = useState<'guest' | 'saved'>('guest');
  const [analytics, setAnalytics] = useState(false);
  const [clinicShare, setClinicShare] = useState(false);
  const [busy, setBusy] = useState(false);

  const continueOn = async () => {
    setBusy(true);
    try {
      await api.putConsent({ analytics, clinicShare, mode });
      await refreshConsent();
    } catch {
      // still continue so a slow demo API cannot trap onboarding
    }
    router.push(path('/method'));
  };

  return (
    <Screen>
      <Title>How do you want to check?</Title>
      <Body>We store only what a check needs. Nobody at a campus can see this unless you turn sharing on.</Body>

      <Pressable
        onPress={() => setMode('guest')}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'guest' }}
        style={[styles.choice, mode === 'guest' && styles.choiceOn]}
      >
        <Text style={styles.choiceTitle}>Check without an account</Text>
        <Muted>Your list lives on this device for the demo. You can delete it later.</Muted>
      </Pressable>
      <Pressable
        onPress={() => setMode('saved')}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'saved' }}
        style={[styles.choice, mode === 'saved' && styles.choiceOn]}
      >
        <Text style={styles.choiceTitle}>Save my profile</Text>
        <Muted>Keeps your method and medications so you do not re-enter them. Passkeys come later.</Muted>
      </Pressable>

      <Card>
        <Text style={styles.choiceTitle}>What we store</Text>
        {whatWeStore.map((item) => (
          <Muted key={item}>• {item}</Muted>
        ))}
        <Muted>We do not store location, cycle data, or sexual activity. We do not run ads.</Muted>
      </Card>

      <Row label="De-identified analytics (off by default)" value={analytics} onChange={setAnalytics} />
      <Row label="Share with my campus clinic (off by default)" value={clinicShare} onChange={setClinicShare} />
      <PrimaryButton label="Continue" onPress={continueOn} disabled={busy} />
    </Screen>
  );
}

const Row = ({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, minHeight: 48 }}>
    <Text style={{ flex: 1, color: tokens.color.ink, fontSize: 16 }}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: tokens.color.line, true: tokens.color.accent }}
      thumbColor={value ? tokens.color.onAccent : tokens.color.surface}
    />
  </View>
);

const styles = {
  choice: {
    borderWidth: 2,
    borderColor: tokens.color.line,
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.md,
    padding: 16,
    gap: 6
  },
  choiceOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.surfaceMuted
  },
  choiceTitle: {
    color: tokens.color.ink,
    fontSize: 16,
    fontWeight: '700' as const
  }
};
