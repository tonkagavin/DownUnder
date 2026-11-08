import type { MedicationSearchHit } from '@downunder/types';
import { tokens } from '@downunder/ui';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSession } from './session';
import { Muted } from './ui';

export type PickedMedication = {
  displayName: string;
  rxcui?: string;
  asWritten?: boolean;
};

export const MedicationSearch = ({
  label,
  placeholder,
  picked,
  onPick
}: {
  label: string;
  placeholder?: string;
  picked: PickedMedication | null;
  onPick: (value: PickedMedication | null) => void;
}) => {
  const { api } = useSession();
  const [query, setQuery] = useState(picked?.displayName ?? '');
  const [hits, setHits] = useState<MedicationSearchHit[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (picked) setQuery(picked.displayName);
  }, [picked]);

  const search = (value: string) => {
    setQuery(value);
    onPick(null);
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 2) {
      setHits([]);
      return;
    }
    timer.current = setTimeout(() => {
      api
        .searchMedications(value)
        .then((data) => setHits(data.medications.slice(0, 8)))
        .catch(() => setHits([]));
    }, 220);
  };

  const choose = (hit: MedicationSearchHit) => {
    onPick({ displayName: hit.name, rxcui: hit.rxcui });
    setQuery(hit.name);
    setHits([]);
  };

  return (
    <View style={{ gap: 8 }}>
      <TextInput
        value={query}
        onChangeText={search}
        placeholder={placeholder ?? 'Search brand or generic'}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel={label}
        style={{
          minHeight: 48,
          borderWidth: 1,
          borderColor: picked ? tokens.color.accent : tokens.color.line,
          borderRadius: 18,
          paddingHorizontal: 14,
          backgroundColor: tokens.color.surface,
          fontSize: 16,
          color: tokens.color.ink
        }}
      />
      {hits.map((hit) => (
        <Pressable
          key={`${hit.rxcui}-${hit.name}`}
          onPress={() => choose(hit)}
          accessibilityRole="button"
          accessibilityLabel={`Use ${hit.name}`}
          style={{
            minHeight: 48,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: tokens.color.surface,
            borderWidth: 1,
            borderColor: tokens.color.line
          }}
        >
          <Text style={{ color: tokens.color.ink, fontWeight: '600' }}>{hit.name}</Text>
          <Text style={{ color: tokens.color.muted, fontSize: 13 }}>Tap to use this product</Text>
        </Pressable>
      ))}
      {query.trim().length >= 2 && !picked ? (
        <Pressable
          onPress={() => {
            onPick({ displayName: query.trim(), asWritten: true });
            setHits([]);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Add ${query} as written`}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={{ color: tokens.color.secondary, fontWeight: '700' }}>Add “{query.trim()}” as written</Text>
          <Muted>We may not be able to check a product we cannot identify.</Muted>
        </Pressable>
      ) : null}
      {picked?.asWritten ? <Muted>Added as written — this may come back as not enough information.</Muted> : null}
      {picked && !picked.asWritten ? <Muted>Selected: {picked.displayName}</Muted> : null}
    </View>
  );
};
