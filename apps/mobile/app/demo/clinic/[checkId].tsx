import type { CheckResult } from '@downunder/types';
import { tokens } from '@downunder/ui';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useSession } from '../../../src/session';
import { Body, Disclaimer, Muted, OutcomeChip, PrimaryButton, Screen, SecondaryButton, Title } from '../../../src/ui';

export default function ClinicCheck() {
  const { checkId } = useLocalSearchParams<{ checkId: string }>();
  const { api } = useSession();
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    api.getCheck(checkId).then((data) => setCheck(data.check)).catch(() => undefined);
  }, [api, checkId]);

  const review = async (outcome: 'confirmed' | 'dismissed' | 'advised') => {
    await api.reviewCheck(checkId, { outcome, note });
    setSaved(outcome);
  };

  if (!check) {
    return (
      <Screen wide>
        <Title>Patient check</Title>
        <Body>Loading…</Body>
      </Screen>
    );
  }

  return (
    <Screen wide>
      <Muted>Consent banner: Maya shared this check for clinical review in the demo tenant.</Muted>
      <OutcomeChip outcome={check.overall} />
      <Title>Independent review</Title>
      <Body>{check.why}</Body>
      <Body>{check.whatToDo}</Body>
      {check.findings.map((finding) => (
        <View key={finding.id} style={{ backgroundColor: tokens.color.surface, padding: 12, borderRadius: 12, gap: 6 }}>
          <Text style={{ fontWeight: '700' }}>
            {finding.subjectName} → {finding.objectName}
          </Text>
          <Body>{finding.why}</Body>
          {finding.evidence.map((item, index) => (
            <Muted key={index}>
              {item.source} {item.section} {item.ruleId}
            </Muted>
          ))}
        </View>
      ))}
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Encrypted note (demo stores locally in PGlite)"
        style={{ minHeight: 64, borderWidth: 1, borderColor: tokens.color.line, borderRadius: 12, padding: 12 }}
      />
      <PrimaryButton label="Confirmed" onPress={() => review('confirmed')} />
      <SecondaryButton label="Dismissed" onPress={() => review('dismissed')} />
      <SecondaryButton label="Advised" onPress={() => review('advised')} />
      {saved ? <Muted>Recorded: {saved}. Coming: PDF export to campus EHR.</Muted> : null}
      <Disclaimer />
    </Screen>
  );
}
