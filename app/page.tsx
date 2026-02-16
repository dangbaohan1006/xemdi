import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-black font-sans">
      {/* Movies Section (Left/Top) */}
      <Link
        href="/phim"
        className="group relative flex-1 h-1/2 md:h-full transition-all duration-700 ease-out hover:flex-[1.5] flex items-center justify-center overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-zinc-800"
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center brightness-[0.3] group-hover:brightness-[0.5] group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Content */}
        <div className="relative z-10 text-center transform transition-transform duration-500 group-hover:scale-105">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-all duration-500">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
            Phim Ảnh
          </h2>
          <p className="text-zinc-300 text-lg md:text-xl font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            Hàng ngàn bộ phim bom tấn<br />đang chờ bạn khám phá
          </p>
          <span className="mt-8 inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
            XEM NGAY
          </span>
        </div>
      </Link>

      {/* Manga Section (Right/Bottom) */}
      <Link
        href="/truyen"
        className="group relative flex-1 h-1/2 md:h-full transition-all duration-700 ease-out hover:flex-[1.5] flex items-center justify-center overflow-hidden"
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center brightness-[0.3] group-hover:brightness-[0.5] group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Content */}
        <div className="relative z-10 text-center transform transition-transform duration-500 group-hover:scale-105">
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] group-hover:shadow-[0_0_50px_rgba(79,70,229,0.8)] transition-all duration-500">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
            Truyện Tranh
          </h2>
          <p className="text-zinc-300 text-lg md:text-xl font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            Kho truyện khổng lồ<br />cập nhật liên tục
          </p>
          <span className="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
            ĐỌC NGAY
          </span>
        </div>
      </Link>
    </div>
  );
}