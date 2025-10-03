import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eesha Silks - Admin Dashboard',
  description: 'Admin dashboard for managing Eesha Silks e-commerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
