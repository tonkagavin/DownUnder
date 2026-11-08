import { teachBackOptions, tokens } from '@downunder/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { CheckResult } from '@downunder/types';
import { useSession } from '../../src/session';
import { Body, Card, Disclaimer, Muted, OutcomeChip, PrimaryButton, Screen, SecondaryButton, SectionLabel, Title } from '../../src/ui';

export default function Result() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { api, lastCheck, setLastCheck } = useSession();
  const router = useRouter();
  const [check, setCheck] = useState<CheckResult | null>(lastCheck?.id === id ? lastCheck : null);
  const [openWhy, setOpenWhy] = useState(false);
  const [openSources, setOpenSources] = useState(false);
  const [teach, setTeach] = useState<string | null>(null);

  useEffect(() => {
    if (check) return;
    api
      .getCheck(id)
      .then((data) => {
        setCheck(data.check);
        setLastCheck(data.check);
      })
      .catch(() => undefined);
  }, [api, check, id, setLastCheck]);

  if (!check) {
    return (
      <Screen tabs>
        <Title>Loading result</Title>
        <Body>Reading your check…</Body>
      </Screen>
    );
  }

  const top = check.findings[0];

  return (
    <Screen tabs>
      <OutcomeChip outcome={check.overall} />
      <Title>{check.why}</Title>
      <Body>{check.whatToDo}</Body>

      <Pressable onPress={() => setOpenWhy(!openWhy)} accessibilityRole="button" accessibilityLabel="Why and what to do">
        <Text style={styles.link}>{openWhy ? 'Hide why and what to do' : 'Why and what to do'}</Text>
      </Pressable>
      {openWhy ? (
        <Card>
          {check.findings.map((finding) => (
            <View key={finding.id} style={{ gap: 6 }}>
              <Text style={{ fontWeight: '700', color: tokens.color.ink }}>
                {finding.subjectName} → {finding.objectName}
              </Text>
              <Body>{finding.why}</Body>
              {finding.durationNote ? <Muted>{finding.durationNote}</Muted> : null}
              {finding.alternativesNote ? <Muted>{finding.alternativesNote}</Muted> : null}
            </View>
          ))}
          {top?.durationNote && check.findings.length === 0 ? <Body>{top.durationNote}</Body> : null}
        </Card>
      ) : null}

      <Pressable onPress={() => setOpenSources(!openSources)} accessibilityRole="button" accessibilityLabel="Show sources">
        <Text style={styles.link}>{openSources ? 'Hide sources' : 'Show sources'}</Text>
      </Pressable>
      {openSources ? (
        <Card>
          {check.findings.flatMap((finding) =>
            finding.evidence.map((item, index) => (
              <Muted key={`${finding.id}-${index}`}>
                {item.source}
                {item.section ? ` · ${item.section}` : ''}
                {item.ruleId ? ` · ${item.ruleId}` : ''}
                {item.quote ? ` — “${item.quote}”` : ''}
              </Muted>
            ))
          )}
        </Card>
      ) : null}

      <Muted>Checked against: {check.checkedAgainst.join(', ')}</Muted>
      <Muted>Not checked: {check.notChecked.join(', ')}</Muted>
      <Muted>Rules version {check.rulesVersion}. Sources updated {check.sourcesUpdated}.</Muted>

      {check.overall === 'knownInteraction' ? (
        <Card>
          <SectionLabel>What will you do next?</SectionLabel>
          {teachBackOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setTeach(option.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: teach === option.id }}
              style={{
                minHeight: 48,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: teach === option.id ? tokens.color.accent : tokens.color.line,
                paddingHorizontal: 12,
                justifyContent: 'center',
                backgroundColor: teach === option.id ? tokens.color.surfaceMuted : tokens.color.bg
              }}
            >
              <Text style={{ color: tokens.color.ink, fontWeight: '600' }}>{option.label}</Text>
            </Pressable>
          ))}
          {teach ? <Muted>Noted. This is for you — we do not send it to a campus.</Muted> : null}
        </Card>
      ) : null}

      <PrimaryButton label="Ask a pharmacist" onPress={() => router.push('/help')} />
      <SecondaryButton
        label="Ask DownUnder about this"
        onPress={() => router.push({ pathname: '/ask', params: { checkId: check.id } })}
      />
      <SecondaryButton label="Check another medication" onPress={() => router.replace('/check')} />
      <Disclaimer />
    </Screen>
  );
}

const styles = {
  link: { color: tokens.color.accent, fontWeight: '700' as const, fontSize: 16, minHeight: 24 }
};
