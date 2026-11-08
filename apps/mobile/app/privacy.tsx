import type { AccessLogEntry, PrivacyExport } from '@downunder/types';
import { tokens, whatWeStore } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useSession } from '../src/session';
import { Body, Card, Muted, PrimaryButton, Screen, SecondaryButton, SectionLabel, Title } from '../src/ui';

export default function Privacy() {
  const { api, profile, methods, consents, refreshConsent, refreshProfile, path } = useSession();
  const router = useRouter();
  const [log, setLog] = useState<AccessLogEntry[]>([]);
  const [exported, setExported] = useState<PrivacyExport | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState(consents?.analytics ?? false);
  const [clinicShare, setClinicShare] = useState(consents?.clinicShare ?? false);

  useEffect(() => {
    api.accessLog().then((data) => setLog(data.log)).catch(() => setLog([]));
    refreshConsent().catch(() => undefined);
  }, [api, refreshConsent]);

  useEffect(() => {
    if (!consents) return;
    setAnalytics(consents.analytics);
    setClinicShare(consents.clinicShare);
  }, [consents]);

  const saveConsent = async (nextAnalytics: boolean, nextShare: boolean) => {
    setAnalytics(nextAnalytics);
    setClinicShare(nextShare);
    await api.putConsent({
      analytics: nextAnalytics,
      clinicShare: nextShare,
      mode: consents?.mode === 'saved' ? 'saved' : 'guest'
    });
    await refreshConsent();
  };

  const exportData = async () => {
    const data = await api.exportPrivacy();
    setExported(data.export);
    if (typeof document !== 'undefined') {
      const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'downunder-export.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const deleteAll = async () => {
    const result = await api.deleteProfile();
    await refreshProfile();
    setConfirmDelete(false);
    setMessage(result.message);
    setLog([]);
  };

  return (
    <Screen tabs>
      <Title>Privacy center</Title>
      <Body>We store only what is listed here. We do not sell data. We do not run ads.</Body>
      <Card>
        <SectionLabel>What we store</SectionLabel>
        {whatWeStore.map((item) => (
          <Muted key={item}>• {item}</Muted>
        ))}
        <Muted>
          Right now: {methods.find((row) => row.code === profile?.methodCode)?.plainName ?? 'no method'},{' '}
          {profile?.medications.length ?? 0} medication
          {(profile?.medications.length ?? 0) === 1 ? '' : 's'}.
        </Muted>
      </Card>
      <Card>
        <SectionLabel>Consent</SectionLabel>
        <Toggle label="De-identified analytics" value={analytics} onChange={(value) => saveConsent(value, clinicShare)} />
        <Toggle label="Share with my campus clinic" value={clinicShare} onChange={(value) => saveConsent(analytics, value)} />
      </Card>
      <Card>
        <SectionLabel>Who viewed my data</SectionLabel>
        {log.length === 0 ? <Muted>Only you in this session so far.</Muted> : null}
        {log.slice(0, 8).map((row) => (
          <Muted key={row.id}>
            {row.who} — {row.action}
          </Muted>
        ))}
      </Card>
      <PrimaryButton label="Export my data" onPress={exportData} />
      {exported ? <Muted>Exported {exported.checks.length} check(s) as JSON.</Muted> : null}
      {confirmDelete ? (
        <Card>
          <Body>This deletes your method, medications, health facts, and check results from this demo. Audit records required by law stay, without your medication names.</Body>
          <PrimaryButton label="Delete my data" onPress={deleteAll} />
          <SecondaryButton label="Keep my data" onPress={() => setConfirmDelete(false)} />
        </Card>
      ) : (
        <SecondaryButton label="Delete everything" onPress={() => setConfirmDelete(true)} />
      )}
      {message ? <Muted>{message}</Muted> : null}
      <Pressable onPress={() => router.push(path('/how'))}>
        <Text style={{ color: tokens.color.accent, fontWeight: '700' }}>How DownUnder decides</Text>
      </Pressable>
    </Screen>
  );
}

const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
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
