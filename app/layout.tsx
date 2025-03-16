import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/tailwind.css';
import { Header } from '@/components/ui';
import { Providers } from '@/providers';
import { cn } from '@/util/cn';

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
      <body className={cn('max-[380px]:pb-16 max-xs:pb-18', inter.className)}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
