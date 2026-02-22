import type { Metadata } from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Lì Xì Tết 🧧 Lắc Lì Xì Online',
  description: 'Lắc điện thoại nhận bao lì xì Tết - Trò chơi tương tác vui nhộn',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
