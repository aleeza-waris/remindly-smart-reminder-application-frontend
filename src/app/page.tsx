import type { Metadata } from 'next';
import LandingPage from '../components/marketing/LandingPage';

export const metadata: Metadata = {
  title: 'Remindly | Make time for what matters',
  description:
    'Plan one-time reminders, stay on top of what is coming up, and make time for what matters.',
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ logout?: string | string[] }>;
}) {
  const { logout } = await searchParams;
  const logoutFailed = Array.isArray(logout) ? logout.includes('failed') : logout === 'failed';

  return <LandingPage logoutFailed={logoutFailed} />;
}
