import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CWA Assignment',
  description: 'Assignment 1 - Tabs Generator (HTML+JS with inline CSS)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, Arial, sans-serif',
          lineHeight: 1.5,
        }}
      >
        <Header />
        <main style={{ padding: '16px', minHeight: '70vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
