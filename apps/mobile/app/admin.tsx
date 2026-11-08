import type { AnalyticsMetric } from '@downunder/types';
import { tokens } from '@downunder/ui';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../src/session';
import { Body, Eyebrow, Muted, PrimaryButton, Screen, Title } from '../src/ui';

export default function Admin() {
  const { api } = useSession();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [note, setNote] = useState('');
  const [extractNote, setExtractNote] = useState('');

  useEffect(() => {
    api
      .analytics()
      .then((data) => {
        setMetrics(data.metrics);
        setNote(data.note);
      })
      .catch(() => undefined);
  }, [api]);

  return (
    <Screen wide>
      <Eyebrow>What the campus buys · Phase 1+</Eyebrow>
      <Title>Campus analytics</Title>
      <Body>
        This is the health center director dashboard. Counts are de-identified. Numbers under 10 are hidden so no student
        can be picked out.
      </Body>
      {metrics.map((row) => (
        <View key={row.metric} style={{ backgroundColor: tokens.color.surface, padding: 12, borderRadius: 12 }}>
          <Text style={{ fontWeight: '700' }}>
            {row.metric === 'checksThisWeek'
              ? 'Checks this week'
              : row.metric === 'knownInteractionFlags'
                ? 'Known interaction flags'
                : row.metric === 'possibleInteractionFlags'
                  ? 'Possible interaction flags'
                  : row.metric === 'noneKnownInSources'
                    ? 'No known interaction in our sources'
                    : row.metric === 'insufficientInformation'
                      ? 'Not enough information'
                      : row.metric === 'abstentionRatePct'
                        ? 'Abstention rate %'
                        : row.metric}
          </Text>
          <Text>{row.suppressed ? 'Suppressed (<10)' : row.value}</Text>
        </View>
      ))}
      <Muted>{note}</Muted>
      <PrimaryButton
        label="Run label extraction on rifampin"
        onPress={async () => {
          const data = await api.runExtraction('9384');
          setExtractNote(`${data.statements.length} statement(s) from the cached label.`);
        }}
      />
      {extractNote ? <Muted>{extractNote}</Muted> : null}
      <Muted>Coming: SSO, retention settings, live tenant data.</Muted>
    </Screen>
  );
}
