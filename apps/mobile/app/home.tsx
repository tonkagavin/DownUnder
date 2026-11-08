import { tokens } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMethodLabel, useSession } from '../src/session';
import { Body, BrandMark, Card, Disclaimer, MethodGlyph, MoreLinks, Muted, OutcomeChip, PrimaryButton, Screen, SecondaryButton, SectionLabel, Title } from '../src/ui';
import type { CheckResult } from '@downunder/types';

export default function Home() {
  const { api, profile, refreshProfile } = useSession();
  const methodLabel = useMethodLabel();
  const router = useRouter();
  const [recent, setRecent] = useState<CheckResult[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refreshProfile().catch(() => undefined);
    api
      .listChecks()
      .then((data) => setRecent(data.checks.slice(0, 6)))
      .catch(() => setRecent([]));
  }, [api, refreshProfile]);

  const checkWholeList = async () => {
    setBusy(true);
    try {
      const { check } = await api.createCheck({ checkWholeList: true });
      router.push(`/result/${check.id}`);
    } finally {
      setBusy(false);
    }
  };

  const meds = profile?.medications ?? [];

  return (
    <Screen tabs>
      <BrandMark compact />
      <Title>{profile?.displayName ? `Hi, ${profile.displayName}.` : 'Your checks'}</Title>
      <Body>Your method and list stay here. Check a new medicine against both in under a minute.</Body>

      <Pressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel="Open profile">
        <Card>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <MethodGlyph code={profile?.methodCode ?? 'notSure'} size={48} />
            <View style={{ flex: 1, gap: 4 }}>
              <SectionLabel>Your method</SectionLabel>
              <Text style={{ fontWeight: '700', fontSize: 18, color: tokens.color.ink }}>{methodLabel}</Text>
              <Muted>
                {meds.length === 0
                  ? 'No other medications yet'
                  : meds.map((med) => med.displayName).join(', ')}
              </Muted>
            </View>
          </View>
          <Text style={{ color: tokens.color.accent, fontWeight: '700', marginTop: 4 }}>Edit profile</Text>
        </Card>
      </Pressable>

      <PrimaryButton label="Check a medication" onPress={() => router.push('/check')} />
      <SecondaryButton label={busy ? 'Checking your list…' : 'Check my whole list'} onPress={checkWholeList} disabled={busy} />

      <SectionLabel>Recent checks</SectionLabel>
      {recent.length === 0 ? (
        <Muted>None yet. Pick a method, then check a medicine you were just prescribed.</Muted>
      ) : (
        recent.map((check) => {
          const subject = check.findings[0]?.subjectName ?? 'Check';
          return (
            <Pressable key={check.id} onPress={() => router.push(`/result/${check.id}`)} accessibilityRole="button">
              <Card>
                <OutcomeChip outcome={check.overall} />
                <Text style={{ color: tokens.color.ink, fontWeight: '700' }}>{subject}</Text>
                <Muted>{check.why}</Muted>
              </Card>
            </Pressable>
          );
        })
      )}
      <MoreLinks />
      <Disclaimer />
      <Pressable onPress={() => router.push('/coming')}>
        <Muted>Coming: missed-dose reminders</Muted>
      </Pressable>
    </Screen>
  );
}
