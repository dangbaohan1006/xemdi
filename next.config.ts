import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'phimimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.phimapi.com', pathname: '/**' }, // Nguồn dự phòng
      { protocol: 'https', hostname: 'img.ophim.cc', pathname: '/**' },    // Nguồn cũ
      { protocol: 'https', hostname: 'img.nguonc.com', pathname: '/**' }, // NguonC (Anime)
    ],
    // Tùy chọn: Tắt Image Optimization nếu muốn tiết kiệm quota Vercel (Vì ảnh nguồn đã nén rồi)
    unoptimized: true,
  },
};

export default nextConfig;