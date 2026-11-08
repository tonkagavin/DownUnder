import { tokens } from '@downunder/ui';
import { Text, View } from 'react-native';
import { Body, Card, Muted, OutcomeChip, Screen, Title } from '../src/ui';

export default function How() {
  return (
    <Screen tabs>
      <Title>How DownUnder decides</Title>
      <Body>
        We apply reviewed guideline tables first (enzyme inducers, reverse effects, absorption, eligibility, medicines that
        need reliable contraception). Then we read the FDA label. A sentence classifier can only add a “possible
        interaction” with a quoted passage. It cannot override a table.
      </Body>
      <Card>
        <View style={{ gap: 10 }}>
          <OutcomeChip outcome="knownInteraction" />
          <Text style={{ color: tokens.color.ink }}>A guideline names this pair. Act on the advice, then ask a pharmacist.</Text>
          <OutcomeChip outcome="possibleInteraction" />
          <Text style={{ color: tokens.color.ink }}>The label mentions something that may matter. Check before relying on your method alone.</Text>
          <OutcomeChip outcome="noneKnownInSources" />
          <Text style={{ color: tokens.color.ink }}>We found nothing in the sources we check. That is not the same as “safe”.</Text>
          <OutcomeChip outcome="insufficientInformation" />
          <Text style={{ color: tokens.color.ink }}>We could not tell. Ask a pharmacist. This does not mean the combination is fine.</Text>
        </View>
      </Card>
      <Muted>Sources: CDC US MEC, FSRH drug-interaction guidance, FDA labels. Rules version is shown on every result.</Muted>
    </Screen>
  );
}
