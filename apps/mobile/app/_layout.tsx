import { tokens } from '@downunder/ui';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SessionProvider, useSession, type Role } from '../src/session';

const Switcher = () => {
  const { role, setRole } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/clinic')) setRole('clinician');
    else if (pathname.startsWith('/admin')) setRole('admin');
    else if (pathname !== '/') setRole('patient');
  }, [pathname, setRole]);

  const go = (next: Role) => {
    setRole(next);
    if (next === 'clinician') router.push('/clinic');
    else if (next === 'admin') router.push('/admin');
    else router.push('/home');
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
    </View>
  );
};

export default function Layout() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.color.bg }}>
          <Switcher />
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
