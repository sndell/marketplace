import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/tailwind.css';
import { Header, Navbar } from '@/components/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Marketplace to buy and sell items.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
