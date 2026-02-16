export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getAnimeList } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { Sparkles } from 'lucide-react';

export default async function AnimePage() {
    let animeList: any[] = [];
    let error = null;

    try {
        console.log('[AnimePage] Fetching anime list...');
        const data = await getAnimeList(1);
        animeList = data.items || [];
    } catch (e) {
        error = (e as Error).message;
        console.error('[AnimePage] Error:', error);
    }

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center gap-3">
                        <Sparkles className="w-10 h-10 text-purple-500" />
                        <span className="gradient-text">Anime</span>
                    </h1>
                    <p className="text-zinc-400 mt-3 text-lg">
                        Phim hoạt hình Nhật Bản mới nhất
                    </p>
                </div>

                {error ? (
                    <div className="glass rounded-2xl p-8 text-center">
                        <p className="text-zinc-400 text-lg">{error}</p>
                    </div>
                ) : animeList.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center">
                        <p className="text-zinc-400 text-lg">Không có anime nào</p>
                    </div>
                ) : (
                    <section>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
                            {animeList.map((anime) => (
                                <MovieCard key={anime._id} movie={anime} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
