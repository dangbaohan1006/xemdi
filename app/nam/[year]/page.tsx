export const dynamic = 'force-dynamic';

import { getMoviesByYear } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Calendar } from 'lucide-react';
import type { LatestMoviesResponse } from '@/lib/types';

interface YearPageProps {
    params: Promise<{ year: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function YearPage({ params, searchParams }: YearPageProps) {
    const { year } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const yearNum = parseInt(year, 10);

    let movies: LatestMoviesResponse['items'] = [];
    let pagination: LatestMoviesResponse['pagination'];
    let error = null;

    try {
        console.log(`[YearPage] Fetching year ${year}, page ${currentPage}...`);
        const data = await getMoviesByYear(yearNum, currentPage);
        movies = data.items || [];
        pagination = data.pagination;
        console.log(`[YearPage] Loaded ${movies.length} movies from ${year}`, pagination);
    } catch (e) {
        error = (e as Error).message;
        console.error('[YearPage] Error:', error);
    }

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-red-500" />
                        <span className="gradient-text">Phim Năm {year}</span>
                    </h1>
                    <p className="text-zinc-400 mt-2">Bộ sưu tập phim ra mắt năm {year}</p>
                </div>

                {error ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-red-400 text-lg">Lỗi: {error}</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-zinc-400 text-lg">Không có phim nào năm {year}</p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} />
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
