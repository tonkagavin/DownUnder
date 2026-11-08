import { tokens } from '@downunder/ui';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';
import { Body, Card, Muted, PrimaryButton, Screen, SecondaryButton, Title } from '../src/ui';

export default function Help() {
  return (
    <Screen tabs>
      <Title>Find a pharmacist or clinic</Title>
      <Body>If a check says to ask someone, start here. DownUnder is not an emergency service.</Body>
      <Card>
        <Text style={{ fontWeight: '700', color: tokens.color.ink, fontSize: 16 }}>Demo campus clinic</Text>
        <Body>Weekdays 8am–5pm</Body>
        <Muted>Phone (555) 010-0147. Coming: a live locator for your campus.</Muted>
        <PrimaryButton label="Call clinic (demo number)" onPress={() => Linking.openURL('tel:5550100147')} />
      </Card>
      <Card>
        <Text style={{ fontWeight: '700', color: tokens.color.ink, fontSize: 16 }}>Pharmacist</Text>
        <Body>A pharmacist can check the same question with your full prescription record.</Body>
        <SecondaryButton label="Poison control (US)" onPress={() => Linking.openURL('tel:18002221222')} />
      </Card>
      <Muted>If this is an emergency, call 911.</Muted>
    </Screen>
  );
}
