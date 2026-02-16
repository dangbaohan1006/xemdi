import { LatestMoviesResponse as MovieListResponse, MovieDetailResponse, MovieSummary, AnimeListResponse } from './types';

const BASE_URL = 'https://phimapi.com';
const NGUONC_URL = 'https://phim.nguonc.com/api';

export async function getLatestMovies(page: number = 1): Promise<MovieListResponse> {
    const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch movies: ${res.status}`);
    }

    return res.json();
}

export async function getMovieBySlug(slug: string): Promise<MovieDetailResponse> {
    const res = await fetch(`${BASE_URL}/phim/${slug}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch movie: ${res.status}`);
    }

    return res.json();
}

export async function searchMovies(keyword: string, page: number = 1): Promise<MovieListResponse> {
    const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`Failed to search movies: ${res.status}`);
    }

    return res.json();
}

// ========== ANIME SOURCE (NguonC) ==========

/**
 * Normalize NguonC movie data to match our unified MovieSummary interface
 */
function normalizeNguonCMovie(nguoncMovie: any): MovieSummary {
    return {
        _id: nguoncMovie._id || nguoncMovie.id || '',
        name: nguoncMovie.name || '',
        slug: nguoncMovie.slug || '',
        origin_name: nguoncMovie.origin_name || nguoncMovie.original_name || '',
        poster_url: nguoncMovie.thumb_url || nguoncMovie.poster_url || '', // NguonC uses thumb_url
        thumb_url: nguoncMovie.thumb_url || nguoncMovie.poster_url || '',
        year: nguoncMovie.year || new Date().getFullYear(),
    };
}

export async function getAnimeList(page: number = 1): Promise<MovieListResponse> {
    const res = await fetch(`${NGUONC_URL}/films/the-loai/hoat-hinh?page=${page}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch anime: ${res.status}`);
    }

    const data: AnimeListResponse = await res.json();

    // Normalize NguonC data to match our structure
    return {
        status: data.status === 'success',
        items: (data.items || []).map(normalizeNguonCMovie),
    };
}
