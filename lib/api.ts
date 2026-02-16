import { LatestMoviesResponse as MovieListResponse, MovieDetailResponse } from './types';

const BASE_URL = 'https://phimapi.com';

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
