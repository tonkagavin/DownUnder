import { disclaimers } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '../src/session';
import { Body, BrandMark, Card, Disclaimer, Eyebrow, Muted, PrimaryButton, Screen, Title } from '../src/ui';

export default function Welcome() {
  const router = useRouter();
  const { profile } = useSession();
  return (
    <Screen>
      <BrandMark />
      <Eyebrow>For students on birth control</Eyebrow>
      <Title>Check a medicine against your birth control.</Title>
      <Body>DownUnder tells you whether they affect each other, cites the source, and asks a pharmacist when it cannot tell.</Body>
      <Card>
        <Body>It does not check every drug against every drug.</Body>
        <Body>It does not replace a pharmacist or clinician.</Body>
        <Body>It never says “safe”.</Body>
      </Card>
      {profile?.methodCode ? (
        <PrimaryButton label="Go to home" onPress={() => router.replace('/home')} />
      ) : (
        <PrimaryButton label="Continue" onPress={() => router.push('/consent')} />
      )}
      <View style={{ gap: 6 }}>
        <Disclaimer />
        <Muted>{disclaimers.neverSafe}</Muted>
      </View>
    </Screen>
  );
}
