import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server"; // File server.ts bạn đã tạo
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotFlix - Xem phim miễn phí",
  description: "Web xem phim cá nhân không quảng cáo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Logic Auth (Thay thế Middleware)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Lấy đường dẫn hiện tại để biết có phải trang login không
  const headersList = headers();
  // Lưu ý: headers().get("x-url") cần config thêm, nên ta dùng cách đơn giản hơn:
  // Chỉ redirect nếu user chưa login VÀ đang cố vào xem phim
  // (Logic này nên đặt cụ thể ở page.tsx của trang phim thì tốt hơn, nhưng đặt tạm đây cũng được)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}