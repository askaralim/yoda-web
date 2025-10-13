import { Suspense } from 'react';
import ProfilePage from '@/components/pages/ProfilePage';

export const dynamic = 'force-dynamic';

export default function Profile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
