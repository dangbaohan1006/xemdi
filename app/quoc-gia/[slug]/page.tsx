import { Suspense } from 'react';
import Link from 'next/link';
import { Globe, Sparkles } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { COUNTRIES } from '@/lib/api';
import { MovieListResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface Props {
    params: { slug: string };
    searchParams: { page?: string };
}

async function fetchCountryMovies(slug: string, page: number): Promise<MovieListResponse> {
    try {
        const res = await fetch(`https://phimapi.com/v1/api/quoc-gia/${slug}?page=${page}&limit=18`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[Country] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
        const paginationData = data?.data?.params?.pagination || data?.params?.pagination;

        return {
            status: data.status || false,
            items: data.data?.items || data.items || [],
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 18
            } : undefined
        };
    } catch (error) {
        console.error('[Country] Error:', error);
        return { status: false, items: [] };
    }
}

export default async function CountryPage({ params, searchParams }: Props) {
    const { slug } = params;
    const page = Number(searchParams.page) || 1;

    const country = COUNTRIES.find(c => c.slug === slug);
    const countryName = country?.name || 'Quốc Gia';

    const data = await fetchCountryMovies(slug, page);
    const movies = data.items || [];
    const pagination = data.pagination;

    return (
        <div className="hero-gradient min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <Globe className="w-8 h-8 text-red-500" />
                        <span className="gradient-text">{countryName}</span>
                    </h1>
                    <p className="text-zinc-400 mt-2">Phim {countryName}</p>
                </div>

                {movies.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-400 text-lg">Không tìm thấy phim nào</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                            {movies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
