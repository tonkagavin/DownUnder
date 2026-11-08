import { tokens } from '@downunder/ui';
import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SessionProvider } from '../src/session';

export default function Layout() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.color.bg }}>
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
