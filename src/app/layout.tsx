import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../features/auth/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DemoApp – Your Modern Dashboard',
  description: 'A modern Next.js dashboard app with Firebase authentication.',
  openGraph: {
    title: 'DemoApp – Your Modern Dashboard',
    description: 'A modern Next.js dashboard app with Firebase authentication.',
    url: 'https://your-demoapp-domain.com',
    siteName: 'DemoApp',
    images: [
      {
        url: '/next.svg',
        width: 1200,
        height: 630,
        alt: 'DemoApp Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DemoApp – Your Modern Dashboard',
    description: 'A modern Next.js dashboard app with Firebase authentication.',
    images: ['/next.svg'],
    creator: '@yourtwitter',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
