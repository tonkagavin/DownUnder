import { tokens } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { MedicationSearch, type PickedMedication } from '../src/medicationSearch';
import { useMethodLabel, useSession } from '../src/session';
import { Body, Card, Disclaimer, MethodGlyph, Muted, PrimaryButton, ProgressTrack, Screen, SecondaryButton, Title } from '../src/ui';

export default function Check() {
  const { api, profile, setLastCheck, path } = useSession();
  const methodLabel = useMethodLabel();
  const router = useRouter();
  const [picked, setPicked] = useState<PickedMedication | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!picked) return;
    setError(null);
    setStep(1);
    try {
      await new Promise((resolve) => setTimeout(resolve, 280));
      setStep(2);
      await new Promise((resolve) => setTimeout(resolve, 280));
      setStep(3);
      const { check } = await api.createCheck({
        searchedMedication: { displayName: picked.displayName, rxcui: picked.rxcui }
      });
      setLastCheck(check);
      router.push(path(`/result/${check.id}`));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not complete this check. That does not mean it is fine. Ask a pharmacist, or try again later.'
      );
    } finally {
      setStep(null);
    }
  };

  const meds = profile?.medications ?? [];

  return (
    <Screen tabs>
      <Title>Check a medication</Title>
      <Body>We check it against your method, your other medications, and your health facts.</Body>
      <Card>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <MethodGlyph code={profile?.methodCode ?? 'notSure'} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: tokens.color.ink }}>{methodLabel}</Text>
            <Muted>{meds.length ? meds.map((med) => med.displayName).join(', ') : 'No other medications on your list'}</Muted>
          </View>
        </View>
      </Card>
      <MedicationSearch
        label="Medication search"
        placeholder="Type a brand or generic name"
        picked={picked}
        onPick={setPicked}
      />
      {step ? <ProgressTrack step={step} /> : null}
      {error ? <Body>{error}</Body> : null}
      <PrimaryButton
        label={picked ? `Check ${picked.displayName}` : 'Select a medication first'}
        onPress={run}
        disabled={!picked || !!step}
      />
      <SecondaryButton label="Edit method and list" onPress={() => router.push(path('/profile'))} />
      <Disclaimer />
    </Screen>
  );
}
