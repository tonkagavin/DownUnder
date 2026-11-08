import { tokens } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MedicationSearch, type PickedMedication } from '../src/medicationSearch';
import { useSession } from '../src/session';
import { Body, Card, Muted, PrimaryButton, Screen, SecondaryButton, Title } from '../src/ui';

export default function Medications() {
  const { api, profile, refreshProfile, path } = useSession();
  const router = useRouter();
  const [picked, setPicked] = useState<PickedMedication | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!picked) return;
    setBusy(true);
    try {
      await api.addMedication({ displayName: picked.displayName, rxcuiInput: picked.rxcui });
      await refreshProfile();
      setPicked(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Title>Your other medications</Title>
      <Body>Add medicines besides birth control — prescriptions, OTC, and supplements. You can add more later.</Body>
      <MedicationSearch label="Search medications" picked={picked} onPick={setPicked} />
      <PrimaryButton label={picked ? `Add ${picked.displayName}` : 'Pick a medicine first'} onPress={add} disabled={!picked || busy} />
      <Card>
        {(profile?.medications ?? []).length === 0 ? <Muted>None added yet.</Muted> : null}
        {(profile?.medications ?? []).map((med) => (
          <View key={med.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: tokens.color.ink, fontWeight: '600' }}>{med.displayName}</Text>
              {med.resolved ? null : <Muted>Needs a product match</Muted>}
            </View>
            <Pressable
              onPress={async () => {
                await api.removeMedication(med.id);
                await refreshProfile();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${med.displayName}`}
            >
              <Text style={{ color: tokens.color.accent, fontWeight: '700' }}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </Card>
      <PrimaryButton label="Go to home" onPress={() => router.replace(path('/home'))} />
      <SecondaryButton label="I’ll add it later" onPress={() => router.replace(path('/home'))} />
    </Screen>
  );
}
