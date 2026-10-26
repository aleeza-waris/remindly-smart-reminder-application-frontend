import AuthForm from '../../../components/auth/AuthForm';

type AuthPageProps = {
  searchParams: Promise<{ mode?: string | string[]; next?: string | string[] }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { mode, next } = await searchParams;
  const initialMode = Array.isArray(mode) ? mode[0] : mode;
  const nextDestination = Array.isArray(next) ? next[0] : next;

  return (
    <AuthForm
      initialMode={initialMode === 'register' ? 'register' : 'login'}
      nextDestination={nextDestination}
    />
  );
}
