export const dynamic = 'force-dynamic';

import { getTvShows } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Tv } from 'lucide-react';
import type { MovieListResponse } from '@/lib/types';

interface TvShowsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function TvShowsPage({ searchParams }: TvShowsPageProps) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);

    let tvShows: MovieListResponse['items'] = [];
    let pagination: MovieListResponse['pagination'];
    let error = null;

    try {
        console.log(`[TvShowsPage] Fetching page ${currentPage}...`);
        const data = await getTvShows(currentPage);
        tvShows = data.items || [];
        pagination = data.pagination;
        console.log(`[TvShowsPage] Loaded ${tvShows.length} TV shows`, pagination);
    } catch (e) {
        error = (e as Error).message;
        console.error('[TvShowsPage] Error:', error);
    }

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <Tv className="w-8 h-8 text-red-500" />
                        <span className="gradient-text">TV Shows</span>
                    </h1>
                    <p className="text-zinc-400 mt-2">Khám phá bộ sưu tập TV Shows đặc sắc</p>
                </div>

                {error ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-red-400 text-lg">Lỗi: {error}</p>
                    </div>
                ) : tvShows.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-zinc-400 text-lg">Không có TV Shows nào</p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {tvShows.map((show) => (
                                <MovieCard key={show._id} movie={show} />
                            ))}
                        </div>

                        {pagination && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
