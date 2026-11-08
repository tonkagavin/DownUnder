import { disclaimers } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '../../src/session';
import { Body, BrandMark, Card, Disclaimer, Eyebrow, Muted, PrimaryButton, Screen, SecondaryButton, Title } from '../../src/ui';

export default function DemoHub() {
  const router = useRouter();
  const { setRole } = useSession();
  return (
    <Screen>
      <BrandMark />
      <Eyebrow>Campus demo · not the student product</Eyebrow>
      <Title>Show Maya, Dr. Reyes, and the campus dashboard.</Title>
      <Body>
        This is the walkthrough for a campus health center. The student product is separate — it has no role switcher and
        uses its own profile.
      </Body>
      <Card>
        <Body>Patient: Maya, 20, combined pill, sertraline.</Body>
        <Body>Clinician: Dr. Reyes’s worklist of Maya’s checks. Students never see this.</Body>
        <Body>Admin: de-identified counts. What a campus would buy.</Body>
      </Card>
      <PrimaryButton
        label="Open Maya’s patient app"
        onPress={() => {
          setRole('patient');
          router.replace('/demo/home');
        }}
      />
      <SecondaryButton
        label="Clinician worklist"
        onPress={() => {
          setRole('clinician');
          router.push('/demo/clinic');
        }}
      />
      <SecondaryButton
        label="Campus admin"
        onPress={() => {
          setRole('admin');
          router.push('/demo/admin');
        }}
      />
      <SecondaryButton label="Go to the student product" onPress={() => router.push('/')} />
      <View style={{ gap: 6 }}>
        <Muted>Try rifampin (known interaction), amoxicillin (pick the product), mystery herb (not enough information).</Muted>
        <Disclaimer />
        <Muted>{disclaimers.neverSafe}</Muted>
      </View>
    </Screen>
  );
}
