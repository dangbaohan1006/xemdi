export const dynamic = 'force-dynamic';

import { searchMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Search } from 'lucide-react';
import type { MovieListResponse } from '@/lib/types';

interface SearchPageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, page } = await searchParams;
    const query = q || '';
    const currentPage = parseInt(page || '1', 10);

    let movies: MovieListResponse['items'] = [];
    let pagination: MovieListResponse['pagination'];
    let error = null;

    if (query.trim()) {
        try {
            console.log(`[SearchPage] Searching for: "${query}" (page ${currentPage})`);
            const data = await searchMovies(query, currentPage);
            movies = data.items || [];
            pagination = data.pagination;
            console.log(`[SearchPage] Results count: ${movies.length}`, pagination);
        } catch (e) {
            error = (e as Error).message;
            console.error('[SearchPage] Error:', error);
        }
    }

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        <span className="gradient-text">Kết quả tìm kiếm</span>
                    </h1>
                    {query && (
                        <p className="text-zinc-400 mt-2">
                            Từ khóa: <span className="text-white font-semibold">"{query}"</span>
                        </p>
                    )}
                </div>

                {!query.trim() ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">Nhập từ khóa để tìm kiếm phim</p>
                    </div>
                ) : error ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-red-400 text-lg">Lỗi: {error}</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">Không tìm thấy kết quả nào</p>
                        <p className="text-zinc-600 text-sm mt-2">Thử với từ khóa khác nhé!</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-zinc-500 text-sm mb-4">
                            Tìm thấy <span className="text-white font-semibold">{movies.length}</span> kết quả
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
