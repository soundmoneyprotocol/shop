import type { Metadata } from 'next';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import SneakerTicker from '@/components/SneakerTicker';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoundMoney - Creator Marketplace',
  description: 'Buy and sell sneakers, clothing, art, and collectibles from creators. Direct creator payouts with blockchain escrow.',
  icons: {
    icon: '/sm-bw-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-black antialiased">
        <Providers>
          <Navigation />
          <SneakerTicker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
