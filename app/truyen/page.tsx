export default function TruyenPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    Kho Truyện <span className="text-indigo-400">Khổng Lồ</span>
                </h1>

                <p className="text-zinc-400 text-lg">
                    Tính năng đang được phát triển. Hàng ngàn bộ truyện tranh hấp dẫn sẽ sớm có mặt tại XemĐi.
                </p>

                <div className="pt-4">
                    <span className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-400 text-sm font-medium">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
