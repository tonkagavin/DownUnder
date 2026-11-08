import { disclaimers } from '@downunder/ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '../src/session';
import { Body, BrandMark, Card, Disclaimer, Eyebrow, Muted, PrimaryButton, Screen, SecondaryButton, Title } from '../src/ui';

export default function DemoHub() {
  const router = useRouter();
  const { setRole } = useSession();
  return (
    <Screen>
      <BrandMark />
      <Eyebrow>Campus health center walkthrough</Eyebrow>
      <Title>Show Maya, Dr. Reyes, and the campus dashboard.</Title>
      <Body>
        This is the campus demo: a seeded student, a clinician worklist, and de-identified admin counts. Use the switcher
        at the top to move between roles.
      </Body>
      <Card>
        <Body>Patient: Maya, 20, combined pill, sertraline. A check covers birth control and adverse effects from the label.</Body>
        <Body>Clinician: Dr. Reyes’s worklist of Maya’s checks. Students never see this.</Body>
        <Body>Admin: de-identified counts. What a campus would buy.</Body>
      </Card>
      <PrimaryButton
        label="Open Maya’s patient app"
        onPress={() => {
          setRole('patient');
          router.replace('/home');
        }}
      />
      <SecondaryButton
        label="Clinician worklist"
        onPress={() => {
          setRole('clinician');
          router.push('/clinic');
        }}
      />
      <SecondaryButton
        label="Campus admin"
        onPress={() => {
          setRole('admin');
          router.push('/admin');
        }}
      />
      <View style={{ gap: 6 }}>
        <Muted>Try rifampin (known interaction), amoxicillin (pick the product), mystery herb (not enough information).</Muted>
        <Disclaimer />
        <Muted>{disclaimers.neverSafe}</Muted>
      </View>
    </Screen>
  );
}
