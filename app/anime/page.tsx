export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getAnimeList } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Sparkles } from 'lucide-react';
import type { MovieListResponse } from '@/lib/types';

interface AnimePageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);

    let animeList: MovieListResponse['items'] = [];
    let pagination: MovieListResponse['pagination'];
    let error = null;

    try {
        console.log(`[AnimePage] Fetching anime page ${currentPage}...`);
        const data = await getAnimeList(currentPage);
        animeList = data.items || [];
        pagination = data.pagination;
        console.log(`[AnimePage] Loaded ${animeList.length} anime`, pagination);
    } catch (e) {
        error = (e as Error).message;
        console.error('[AnimePage] Error:', error);
    }

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-red-500" />
                        <span className="gradient-text">Anime</span>
                    </h1>
                    <p className="text-zinc-400 mt-2">Bộ sưu tập anime đặc sắc</p>
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

                        {pagination && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                            />
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
