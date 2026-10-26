import type { Metadata } from 'next';
import AppProviders from '../providers/AppProviders';
import './globals.css';

const initializeTheme = `(() => {
  const key = 'remindly.theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = media.matches ? 'dark' : 'light';

  try {
    const savedTheme = window.localStorage.getItem(key);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme = savedTheme;
    }
  } catch {
    // If browser storage is unavailable, use the operating system preference.
  }

  document.documentElement.dataset.theme = theme;
})();`;

export const metadata: Metadata = {
  title: 'Remindly',
  description: 'Smart reminders delivered right on time.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
