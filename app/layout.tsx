import type { Metadata } from 'next';
import { Fraunces, Space_Grotesk } from 'next/font/google';
import './globals.css';

const display = Fraunces({ variable: '--font-display', subsets: ['latin'] });
const sans = Space_Grotesk({ variable: '--font-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://zauraizrao.netlify.app'),
  title: 'Zauraiz Rao — Full-Stack & WordPress Developer',
  description: 'Zauraiz Rao is a full-stack and custom WordPress developer in Karachi, Pakistan, building practical websites, web products, and business applications with dependable long-term support.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
  },
  openGraph: {
    title: 'Zauraiz Rao — Full-Stack & Custom WordPress Developer',
    description: 'Practical web products, business applications, and long-term website support.',
    url: 'https://zauraizrao.netlify.app',
    siteName: 'Zauraiz Rao Portfolio',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Zauraiz Rao — Full-Stack & Custom WordPress Developer' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zauraiz Rao — Full-Stack & Custom WordPress Developer',
    description: 'Practical web products, business applications, and long-term website support.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
