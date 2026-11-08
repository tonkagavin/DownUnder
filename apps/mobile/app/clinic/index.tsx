import type { Outcome, WorklistItem } from '@downunder/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSession } from '../../src/session';
import { Body, Eyebrow, Muted, OutcomeChip, Screen, Title } from '../../src/ui';

export default function ClinicWorklist() {
  const { api } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WorklistItem[]>([]);

  useEffect(() => {
    api.worklist().then((data) => setItems(data.items)).catch(() => setItems([]));
  }, [api]);

  return (
    <Screen wide>
      <Eyebrow>Campus pilot · Phase 1–2</Eyebrow>
      <Title>Clinician worklist</Title>
      <Body>
        This is Dr. Reyes’s view. Students never see this. In a real campus it would sit behind SSO. Use the Campus demo
        switcher to come here.
      </Body>
      {items.map((item) => (
        <Pressable key={item.checkId} onPress={() => router.push(`/clinic/${item.checkId}`)}>
          <View style={{ gap: 6, paddingVertical: 8 }}>
            <OutcomeChip outcome={item.overall as Outcome} />
            <Body>{item.why}</Body>
            <Muted>
              {item.searchedName ?? 'whole list'} · {item.reviewed ? 'reviewed' : 'awaiting review'}
            </Muted>
          </View>
        </Pressable>
      ))}
      {items.length === 0 ? <Muted>No checks yet. Run one from Maya’s patient home.</Muted> : null}
    </Screen>
  );
}
