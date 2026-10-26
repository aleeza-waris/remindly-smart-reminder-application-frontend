const defaultAuthenticatedPath = '/dashboard';
const allowedProtectedPath = /^\/(dashboard|reminders|settings)(\/|$)/;

export const getSafeAuthenticatedPath = (destination?: string | null) => {
  if (!destination || !destination.startsWith('/') || destination.startsWith('//') || destination.includes('\\')) {
    return defaultAuthenticatedPath;
  }

  const url = new URL(destination, 'https://remindly.invalid');
  if (url.origin !== 'https://remindly.invalid' || !allowedProtectedPath.test(url.pathname)) {
    return defaultAuthenticatedPath;
  }

  return `${url.pathname}${url.search}${url.hash}`;
};
