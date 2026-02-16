import { getLatestMovies } from '@/lib/api';
import type { LatestMoviesResponse as MovieListResponse } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import ContinueWatching from '@/components/ContinueWatching';

export default async function HomePage() {
  let movies: MovieListResponse['items'] = [];
  let error = null;

  try {
    const data = await getLatestMovies(1);
    movies = data.items || [];
  } catch (e) {
    error = 'Không thể tải danh sách phim. Vui lòng thử lại sau.';
    console.error('Failed to fetch movies:', e);
  }

  return (
    <div className="hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gradient-text">Phim Mới</span>{' '}
            <span className="text-red-500">Hôm Nay</span>
          </h1>
          <p className="mt-3 text-zinc-400 text-lg max-w-2xl">
            Xem phim online chất lượng cao, miễn phí, không quảng cáo.
          </p>
        </div>

        {/* Continue Watching */}
        <ContinueWatching />

        {/* Movie Grid */}
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
              <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-zinc-400 text-lg">{error}</p>
              <p className="text-zinc-600 text-sm mt-2">API có thể đang bảo trì.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
