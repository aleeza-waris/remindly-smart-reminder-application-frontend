'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import RemindlyLoading from '../common/RemindlyLoading';
import { frontendConfig } from '../../config/env';
import { getSafeAuthenticatedPath } from '../../lib/authRedirect';
import { clearSessionToken, getSessionToken, setSessionToken } from '../../lib/sessionToken';
import { loginSchema, registerSchema } from '../../schemas/authSchema';
import {
  login,
  register as registerAccount,
  getCurrentUser,
  signInWithGoogle,
} from '../../services/authService';
import type { LoginFormValues, RegisterFormValues } from '../../schemas/authSchema';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

type AuthMode = 'login' | 'register';
type SessionCheckState = 'checking' | 'redirecting' | 'unauthenticated';

const fieldLabelClass = 'grid gap-2 text-sm font-medium text-remindly-charcoal-brown';
const inputClass =
  'min-h-12 w-full rounded-xl border border-remindly-border bg-remindly-surface px-3 text-remindly-text placeholder:text-remindly-placeholder focus:border-remindly-wine-rose focus:outline-none focus:ring-2 focus:ring-remindly-focus/40 aria-invalid:border-remindly-danger';
const iconInputClass = `${inputClass} pl-11`;
const fieldIconClass =
  'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-remindly-muted';
const fieldErrorClass = 'text-sm leading-snug text-remindly-danger';
const modeButtonClass =
  'min-h-11 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus';

export default function AuthForm({
  initialMode = 'login',
  nextDestination,
}: {
  initialMode?: AuthMode;
  nextDestination?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isRegister = mode === 'register';
  const googleClientId = frontendConfig.googleClientId;
  const [formError, setFormError] = useState('');
  const [isDuplicateAccountError, setIsDuplicateAccountError] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [sessionCheckState, setSessionCheckState] =
    useState<SessionCheckState>('checking');
  const [checkedSessionKey, setCheckedSessionKey] = useState<string | null>(null);
  const safeNextDestination = getSafeAuthenticatedPath(nextDestination);
  const sessionCheckKey = `${pathname}:${safeNextDestination}`;
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const nameLength = watch('name')?.length ?? 0;

  useEffect(() => {
    setMode(initialMode);
    reset();
    clearErrors();
    setFormError('');
    setIsDuplicateAccountError(false);
  }, [initialMode, reset, clearErrors]);

  useEffect(() => {
    let isActive = true;
    setSessionCheckState('checking');

    if (!getSessionToken()) {
      setSessionCheckState('unauthenticated');
      setCheckedSessionKey(sessionCheckKey);
      return () => {
        isActive = false;
      };
    }

    void getCurrentUser()
      .then(() => {
        if (isActive) {
          setSessionCheckState('redirecting');
          router.replace(safeNextDestination);
        }
      })
      .catch((error: unknown) => {
        if (isActive && axios.isAxiosError(error) && error.response?.status === 401) {
          clearSessionToken();
        }
        if (isActive) {
          setSessionCheckState('unauthenticated');
          setCheckedSessionKey(sessionCheckKey);
        }
      });

    return () => {
      isActive = false;
    };
  }, [pathname, router, safeNextDestination, sessionCheckKey]);

  const selectMode = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    reset();
    clearErrors();
    setFormError('');
    setIsDuplicateAccountError(false);

    const params = new URLSearchParams({ mode: nextMode });
    if (nextDestination) {
      params.set('next', nextDestination);
    }
    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  const saveAuthentication = (token: string) => {
    setSessionToken(token);
    setFormError('');
    router.replace(safeNextDestination);
  };

  const submitCredentials = async (values: LoginFormValues | RegisterFormValues) => {
    setFormError('');
    setIsDuplicateAccountError(false);

    try {
      const result = isRegister
        ? await registerAccount(values)
        : await login(values);
      saveAuthentication(result.token);
    } catch (error) {
      if (isRegister && axios.isAxiosError(error) && error.response?.status === 409) {
        setFormError('An account with this email already exists.');
        setIsDuplicateAccountError(true);
      } else {
        setFormError(getApiErrorMessage(error));
      }
    }
  };

  const submitGoogleCredential = async (credential: string) => {
    setIsGoogleLoading(true);
    setFormError('');
    setIsDuplicateAccountError(false);

    try {
      const result = await signInWithGoogle(credential);
      saveAuthentication(result.token);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (
    sessionCheckState !== 'unauthenticated' ||
    checkedSessionKey !== sessionCheckKey
  ) {
    return (
      <RemindlyLoading
        message={
          sessionCheckState === 'redirecting'
            ? 'Taking you to your reminders...'
            : 'Checking your session...'
        }
      />
    );
  }

  const content = (
    <main className="grid min-h-dvh place-items-center bg-remindly-warm-cream p-6">
      <section aria-labelledby="auth-heading" className="w-full max-w-md rounded-3xl border border-remindly-border bg-remindly-white p-6 shadow-xl sm:p-8">
        <Image
          src="/assets/remindly.logo.v2.png"
          alt="Remindly"
          className="mx-auto -mt-3 -mb-1 block h-auto w-full max-w-60 object-contain dark:hidden"
          width={578}
          height={432}
          priority
        />
        <Image
          src="/assets/remindly.logo.dark.png"
          alt="Remindly"
          className="mx-auto -mt-3 -mb-1 hidden h-auto w-full max-w-60 object-contain dark:block"
          width={578}
          height={432}
          priority
        />

        <h1 className="text-center text-2xl font-bold tracking-tight text-remindly-charcoal-brown" id="auth-heading">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mb-6 mt-2 text-center text-sm leading-relaxed text-remindly-muted">
          {isRegister
            ? 'Start keeping your schedule organized.'
            : 'Sign in to continue to your reminders.'}
        </p>

        <div aria-label="Authentication mode" className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-remindly-warm-cream p-1">
          <button
            aria-pressed={!isRegister}
            className={`${modeButtonClass} ${!isRegister ? 'bg-remindly-burgundy text-remindly-action-text shadow-sm' : 'text-remindly-muted hover:text-remindly-text-accent'}`}
            onClick={() => selectMode('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            aria-pressed={isRegister}
            className={`${modeButtonClass} ${isRegister ? 'bg-remindly-burgundy text-remindly-action-text shadow-sm' : 'text-remindly-muted hover:text-remindly-text-accent'}`}
            onClick={() => selectMode('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        <form
          aria-busy={isSubmitting || isGoogleLoading}
          className="grid gap-4"
          id="auth-form"
          onSubmit={handleSubmit(submitCredentials)}
          noValidate
        >
          {isRegister && (
            <label className={fieldLabelClass}>
              <span>Name</span>
              <span className="relative block">
                <UserRound aria-hidden="true" className={fieldIconClass} />
                <input
                  aria-describedby={errors.name ? 'name-error name-count' : 'name-count'}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  className={iconInputClass}
                  maxLength={100}
                  placeholder="Your name"
                  {...register('name')}
                />
              </span>
              {errors.name && (
                <span className={fieldErrorClass} id="name-error">
                  {errors.name.message}
                </span>
              )}
              <span className="text-xs font-normal text-remindly-muted" id="name-count">
                {nameLength}/100 characters
              </span>
            </label>
          )}

          <label className={fieldLabelClass}>
            <span>Email</span>
            <span className="relative block">
              <Mail aria-hidden="true" className={fieldIconClass} />
              <input
                aria-describedby={errors.email ? 'email-error email-help' : 'email-help'}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className={iconInputClass}
                maxLength={254}
                placeholder="you@example.com"
                type="email"
                {...register('email')}
              />
            </span>
            {errors.email && (
              <span className={fieldErrorClass} id="email-error">
                {errors.email.message}
              </span>
            )}
            <span className="text-xs font-normal text-remindly-muted" id="email-help">
              Up to 254 characters.
            </span>
          </label>

          <label className={fieldLabelClass}>
            <span>Password</span>
            <span className="relative block">
              <LockKeyhole aria-hidden="true" className={fieldIconClass} />
              <input
                aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
                aria-invalid={Boolean(errors.password)}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                className={iconInputClass}
                placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
                type="password"
                {...register('password')}
              />
            </span>
            {errors.password && (
              <span className={fieldErrorClass} id="password-error">
                {errors.password.message}
              </span>
            )}
            <span className="text-xs font-normal text-remindly-muted" id="password-help">
              {isRegister
                ? 'At least 8 characters. If your password is too long, use a shorter one.'
                : 'Enter your password. If it is too long, use a shorter one.'}
            </span>
          </label>

          {isRegister && (
            <label className={fieldLabelClass}>
              <span>Confirm password</span>
              <input
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                className={inputClass}
                placeholder="Enter your password again"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className={fieldErrorClass} id="confirm-password-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>
          )}

          {formError && (
            <div className="grid gap-2 rounded-xl bg-remindly-danger-soft p-3 text-sm leading-relaxed text-remindly-danger" role="alert">
              <p>{formError}</p>
              {isDuplicateAccountError && (
                <Link
                  className="font-bold underline underline-offset-4"
                  href={`/auth?mode=login${nextDestination ? `&next=${encodeURIComponent(nextDestination)}` : ''}`}
                >
                  Sign in instead
                </Link>
              )}
            </div>
          )}
          <button
            className="mt-1 min-h-12 rounded-xl bg-remindly-burgundy font-semibold text-remindly-action-text transition-colors hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting || isGoogleLoading}
            type="submit"
          >
            {isSubmitting
              ? 'Please wait...'
              : isRegister
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <div aria-hidden="true" className="my-5 flex items-center gap-3 text-xs font-semibold uppercase text-remindly-muted">
          <span className="h-px flex-1 bg-remindly-border" />
          <span>or</span>
          <span className="h-px flex-1 bg-remindly-border" />
        </div>

        <div className="flex min-h-10 w-full justify-center">
          {googleClientId ? (
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (credential) {
                  void submitGoogleCredential(credential);
                } else {
                  setFormError('Google did not return a sign-in credential. Please try again.');
                }
              }}
              onError={() => setFormError('Google Sign-In was unsuccessful. Please try again.')}
              theme="outline"
              shape="rectangular"
              text={isRegister ? 'signup_with' : 'signin_with'}
              width="100%"
            />
          ) : (
            <p className="rounded-xl bg-remindly-warm-cream p-3 text-center text-sm leading-relaxed text-remindly-muted">
              Google Sign-In needs `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the frontend environment.
            </p>
          )}
        </div>
        {isGoogleLoading && (
          <p className="mt-3 text-center text-sm text-remindly-muted" role="status">
            Verifying your Google account...
          </p>
        )}
      </section>
    </main>
  );

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>
  ) : (
    content
  );
}
