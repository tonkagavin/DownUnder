import type { MethodCategory } from '@downunder/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MethodPicker } from '../src/methodPicker';
import { useSession } from '../src/session';
import { Body, PrimaryButton, Screen, Title } from '../src/ui';

export default function Method() {
  const { api, methods, profile, refreshProfile, path } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<MethodCategory | null>(profile?.methodCode ?? null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile?.methodCode) setSelected(profile.methodCode);
  }, [profile?.methodCode]);

  const save = async () => {
    setBusy(true);
    try {
      if (selected) await api.putProfile({ methodCode: selected });
      await refreshProfile();
    } catch {
      // continue so onboarding is not blocked if the demo API is slow
    }
    router.push(path('/medications'));
  };

  return (
    <Screen>
      <Title>Your method</Title>
      <Body>Pick the birth control you use now. “I’m not sure” and “None” are valid.</Body>
      <MethodPicker methods={methods} selected={selected} onSelect={setSelected} />
      <PrimaryButton label="Continue" onPress={save} disabled={!selected || busy} />
    </Screen>
  );
}
