import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClinicCheckRedirect() {
  const { checkId } = useLocalSearchParams<{ checkId: string }>();
  return <Redirect href={`/demo/clinic/${checkId}`} />;
}
