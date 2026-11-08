import { Body, Card, Muted, Screen, Title } from '../src/ui';

export default function Coming() {
  return (
    <Screen tabs>
      <Title>Coming</Title>
      <Body>These are planned, not fake-working:</Body>
      <Card>
        <Muted>Missed-dose reminders (US SPR)</Muted>
        <Muted>Pharmacist quick-check without a patient record</Muted>
        <Muted>Browsable rules tables and change log</Muted>
        <Muted>Live campus analytics</Muted>
        <Muted>Passkeys instead of a guest session</Muted>
        <Muted>Spanish</Muted>
        <Muted>Partner API</Muted>
      </Card>
    </Screen>
  );
}
