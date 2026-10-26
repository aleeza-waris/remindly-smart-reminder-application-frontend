const defaultApiUrl = 'http://localhost:5000/api';
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!configuredApiUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_API_URL must be configured for production.');
}

const parseApiUrl = (value: string) => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL ending in /api.');
  }

  if (
    !['http:', 'https:'].includes(parsedUrl.protocol) ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.search ||
    parsedUrl.hash ||
    parsedUrl.pathname.replace(/\/+$/, '') !== '/api'
  ) {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL ending in /api.');
  }

  return value.replace(/\/+$/, '');
};

export const frontendConfig = {
  apiBaseUrl: parseApiUrl(configuredApiUrl || defaultApiUrl),
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || '',
};
