import { tokens } from '@downunder/ui';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSession, type Role } from '../../src/session';

const Switcher = () => {
  const { role, setRole } = useSession();
  const router = useRouter();
  const go = (next: Role) => {
    setRole(next);
    if (next === 'clinician') router.push('/demo/clinic');
    else if (next === 'admin') router.push('/demo/admin');
    else router.push('/demo/home');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: tokens.color.bg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: tokens.color.line
      }}
    >
      <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: '600' }}>Campus demo</Text>
      {(['patient', 'clinician', 'admin'] as Role[]).map((item) => (
        <Pressable
          key={item}
          onPress={() => go(item)}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${item}`}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: role === item ? tokens.color.secondary : tokens.color.surfaceMuted
          }}
        >
          <Text style={{ color: role === item ? tokens.color.onAccent : tokens.color.secondary, fontSize: 11, fontWeight: '700' }}>
            {item}
          </Text>
        </Pressable>
      ))}
      <Pressable onPress={() => router.push('/')} accessibilityRole="button" accessibilityLabel="Exit to student product">
        <Text style={{ color: tokens.color.accent, fontSize: 11, fontWeight: '700' }}>Exit to product</Text>
      </Pressable>
    </View>
  );
};

export default function DemoLayout() {
  const pathname = usePathname();
  const { setRole } = useSession();
  useEffect(() => {
    if (pathname.startsWith('/demo/clinic')) setRole('clinician');
    else if (pathname.startsWith('/demo/admin')) setRole('admin');
    else setRole('patient');
  }, [pathname, setRole]);
  return (
    <View style={{ flex: 1 }}>
      <Switcher />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}
