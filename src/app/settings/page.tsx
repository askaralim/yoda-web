import { Suspense } from 'react';
import SettingsPage from '@/components/pages/SettingsPage';

export const dynamic = 'force-dynamic';

export default function Settings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
