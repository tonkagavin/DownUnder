import type { ConditionFlag, MethodCategory } from '@downunder/types';
import { tokens } from '@downunder/ui';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { MedicationSearch, type PickedMedication } from '../src/medicationSearch';
import { MethodPicker } from '../src/methodPicker';
import { useSession } from '../src/session';
import { Body, Card, Disclaimer, MoreLinks, Muted, PrimaryButton, Screen, SectionLabel, Title } from '../src/ui';

const CONDITIONS: { id: ConditionFlag; label: string }[] = [
  { id: 'migraineWithAura', label: 'Migraine with aura' },
  { id: 'hypertension', label: 'High blood pressure' },
  { id: 'vteHistory', label: 'History of a blood clot' },
  { id: 'breastfeeding', label: 'Breastfeeding' }
];

export default function Profile() {
  const { api, profile, methods, refreshProfile } = useSession();
  const [age, setAge] = useState(String(profile?.healthFacts.ageYears ?? ''));
  const [smoker, setSmoker] = useState(profile?.healthFacts.smoker ?? false);
  const [flags, setFlags] = useState<ConditionFlag[]>(profile?.healthFacts.conditionFlags ?? []);
  const [picked, setPicked] = useState<PickedMedication | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [changeMethod, setChangeMethod] = useState(false);

  useEffect(() => {
    refreshProfile().catch(() => undefined);
  }, [refreshProfile]);

  useEffect(() => {
    if (!profile) return;
    setAge(String(profile.healthFacts.ageYears ?? ''));
    setSmoker(profile.healthFacts.smoker);
    setFlags(profile.healthFacts.conditionFlags);
  }, [profile]);

  const saveFacts = async () => {
    const ageYears = age.trim() ? Number(age) : null;
    await api.putProfile({
      ageYears: ageYears && Number.isFinite(ageYears) ? ageYears : null,
      smoker,
      conditionFlags: flags
    });
    await refreshProfile();
    setSaved('Health facts saved. They are used only for eligibility checks such as smoking at 35+ with the combined pill.');
  };

  const setMethod = async (code: MethodCategory) => {
    await api.putProfile({ methodCode: code });
    await refreshProfile();
    setChangeMethod(false);
  };

  const add = async () => {
    if (!picked) return;
    await api.addMedication({ displayName: picked.displayName, rxcuiInput: picked.rxcui });
    await refreshProfile();
    setPicked(null);
  };

  return (
    <Screen tabs>
      <Title>Your profile</Title>
      <Body>Every check uses this: your method, the other medicines you take, and a few health facts.</Body>

      <Card>
        <SectionLabel>Birth control method</SectionLabel>
        <Muted>IUDs and the shot are not affected by most medicines.</Muted>
        {changeMethod ? (
          <MethodPicker methods={methods} selected={profile?.methodCode ?? null} onSelect={setMethod} />
        ) : (
          <Pressable onPress={() => setChangeMethod(true)} accessibilityRole="button" accessibilityLabel="Change method">
            <Text style={{ fontWeight: '700', fontSize: 18, color: tokens.color.ink, marginTop: 4 }}>
              {methods.find((row) => row.code === profile?.methodCode)?.plainName ?? 'Choose a method'}
            </Text>
            <Text style={{ color: tokens.color.accent, fontWeight: '700', marginTop: 6 }}>Change method</Text>
          </Pressable>
        )}
      </Card>

      <Card>
        <SectionLabel>Other medications</SectionLabel>
        <Muted>Not including your birth control.</Muted>
        <MedicationSearch label="Search medications to add" picked={picked} onPick={setPicked} />
        <PrimaryButton label={picked ? `Add ${picked.displayName}` : 'Pick a medicine to add'} onPress={add} disabled={!picked} />
        {(profile?.medications ?? []).map((med) => (
          <View key={med.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}>
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

      <Card>
        <SectionLabel>Health facts</SectionLabel>
        <Muted>Used for eligibility. We do not collect location, cycle, or sexual activity.</Muted>
        <Text style={{ color: tokens.color.ink, marginTop: 8 }}>Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          accessibilityLabel="Age"
          style={{
            minHeight: 48,
            borderWidth: 1,
            borderColor: tokens.color.line,
            borderRadius: 18,
            paddingHorizontal: 12,
            backgroundColor: tokens.color.bg,
            fontSize: 16,
            color: tokens.color.ink
          }}
        />
        <ToggleRow label="I smoke" value={smoker} onChange={setSmoker} />
        {CONDITIONS.map((item) => (
          <ToggleRow
            key={item.id}
            label={item.label}
            value={flags.includes(item.id)}
            onChange={(on) => setFlags(on ? [...flags, item.id] : flags.filter((flag) => flag !== item.id))}
          />
        ))}
        <PrimaryButton label="Save health facts" onPress={saveFacts} />
        {saved ? <Muted>{saved}</Muted> : null}
      </Card>

      <MoreLinks />
      <Disclaimer />
    </Screen>
  );
}

const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
    <Text style={{ color: tokens.color.ink, flex: 1, fontSize: 16 }}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: tokens.color.line, true: tokens.color.accent }}
      thumbColor={value ? tokens.color.onAccent : tokens.color.surface}
    />
  </View>
);
