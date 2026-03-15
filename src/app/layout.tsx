import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/items/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Tracker | Manage Your Investments',
    template: '%s | Portfolio Tracker',
  },
  description:
    'A powerful and intuitive portfolio tracker to manage your stocks, crypto, and other investments in one place. Monitor your P&L, risk distribution, and more.',
  keywords: [
    'portfolio tracker',
    'investment management',
    'stock tracker',
    'crypto portfolio',
    'P&L tracking',
  ],
  authors: [{ name: 'Abhishek Chatterjee' }],
  creator: 'Abhishek Chatterjee',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-tracker.example.com',
    siteName: 'Portfolio Tracker',
    title: 'Portfolio Tracker | Manage Your Investments',
    description: 'Track and manage your investment portfolio with ease.',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Portfolio Tracker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Tracker | Manage Your Investments',
    description: 'Track and manage your investment portfolio with ease.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(30, 30, 50, 0.95)',
              color: '#ededed',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0a0a1a' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0a0a1a' },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
