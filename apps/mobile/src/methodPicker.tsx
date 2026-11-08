import type { MethodCard, MethodCategory } from '@downunder/types';
import { methodVisual, tokens } from '@downunder/ui';
import { Pressable, Text, View } from 'react-native';
import { MethodGlyph, Muted } from './ui';

export const MethodPicker = ({
  methods,
  selected,
  onSelect
}: {
  methods: MethodCard[];
  selected: MethodCategory | null;
  onSelect: (code: MethodCategory) => void;
}) => {
  const current = methods.find((row) => row.code === selected);
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {methods.map((method) => {
          const on = selected === method.code;
          const visual = methodVisual[method.code];
          return (
            <Pressable
              key={method.code}
              onPress={() => onSelect(method.code)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={method.plainName}
              style={{
                width: '47%',
                minHeight: 96,
                borderRadius: tokens.radius.md,
                padding: 12,
                gap: 8,
                borderWidth: 2,
                borderColor: on ? tokens.color.accent : tokens.color.line,
                backgroundColor: on ? tokens.color.surfaceMuted : tokens.color.surface
              }}
            >
              <MethodGlyph code={method.code} />
              <Text style={{ fontWeight: '700', color: tokens.color.ink }}>{method.plainName}</Text>
              <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 16 }}>{visual?.short}</Text>
            </Pressable>
          );
        })}
      </View>
      {current ? <Muted>{current.note}</Muted> : null}
    </View>
  );
};
