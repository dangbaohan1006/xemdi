export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getLatestMovies } from '@/lib/api';
import type { LatestMoviesResponse as MovieListResponse } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import ContinueWatching from '@/components/ContinueWatching';
import Pagination from '@/components/Pagination';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);

  let movies: MovieListResponse['items'] = [];
  let pagination: MovieListResponse['pagination'];
  let error = null;

  try {
    console.log(`[HomePage] Fetching page ${currentPage}...`);
    const data = await getLatestMovies(currentPage);
    movies = data.items || [];
    pagination = data.pagination;
    console.log(`[HomePage] Loaded ${movies.length} movies, pagination:`, pagination);
  } catch (e) {
    error = 'Không thể tải danh sách phim. Vui lòng thử lại sau.';
    console.error('Failed to fetch movies:', e);
  }

  return (
    <div className="hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gradient-text">Phim Mới</span>{' '}
            <span className="text-red-500">Hôm Nay</span>
          </h1>
          <p className="mt-3 text-zinc-400 text-lg max-w-2xl">
            Xem phim online chất lượng cao, miễn phí, không quảng cáo.
          </p>
        </div>

        <ContinueWatching />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Mới Cập Nhật
            </h2>
          </div>

          {error ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-zinc-400 text-lg">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}

          {!error && pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </section>
      </div>
    </div>
  );
}