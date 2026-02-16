import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'XemĐi — Xem Phim Online Miễn Phí',
  description: 'Xem phim online chất lượng cao, miễn phí, không quảng cáo. Phim mới cập nhật hàng ngày.',
  keywords: 'xem phim, phim online, phim miễn phí, phim HD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-zinc-600">
              © 2026 XemĐi — Dự án cá nhân. Dữ liệu phim từ KKPhim API.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
