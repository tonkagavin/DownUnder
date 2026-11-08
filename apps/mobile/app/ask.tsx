import type { AskResponse } from '@downunder/types';
import { tokens } from '@downunder/ui';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSession } from '../src/session';
import { Body, Card, Disclaimer, Muted, PrimaryButton, Screen, Title } from '../src/ui';

const prompts = [
  'Does rifampin affect the pill?',
  'Do most antibiotics cancel the pill?',
  'Does the copper IUD interact with medicines?'
];

export default function Ask() {
  const { checkId } = useLocalSearchParams<{ checkId?: string }>();
  const { api } = useSession();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async (text = question) => {
    const next = text.trim();
    if (next.length < 2) return;
    setQuestion(next);
    setBusy(true);
    try {
      const { ask } = await api.ask({ question: next, checkId });
      setAnswer(ask);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen tabs>
      <Title>Ask DownUnder</Title>
      <Body>Answers come from our reviewed tables and labels, with citations. Your profile is not sent to a third-party model. This is not a doctor.</Body>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Does rifampin affect the pill?"
        accessibilityLabel="Question"
        multiline
        style={{
          minHeight: 88,
          borderWidth: 1,
          borderColor: tokens.color.line,
          borderRadius: 18,
          padding: 14,
          backgroundColor: tokens.color.surface,
          fontSize: 16,
          color: tokens.color.ink
        }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {prompts.map((item) => (
          <Pressable
            key={item}
            onPress={() => send(item)}
            accessibilityRole="button"
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: tokens.color.line,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: tokens.color.surface
            }}
          >
            <Text style={{ color: tokens.color.secondary, fontWeight: '600', fontSize: 13 }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <PrimaryButton label={busy ? 'Looking in our sources…' : 'Ask'} onPress={() => send()} disabled={busy} />
      {answer ? (
        <Card>
          <Text style={{ fontWeight: '700', color: tokens.color.ink }}>
            {answer.kind === 'refusal' ? 'We cannot answer that' : 'From our sources'}
          </Text>
          <Body>{answer.text}</Body>
          {answer.citations.map((item, index) => (
            <Muted key={index}>
              {item.source}
              {item.section ? ` · ${item.section}` : ''}
              {item.ruleId ? ` · ${item.ruleId}` : ''}
            </Muted>
          ))}
        </Card>
      ) : null}
      <Disclaimer />
    </Screen>
  );
}
