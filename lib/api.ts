import { LatestMoviesResponse as MovieListResponse, MovieDetailResponse, MovieSummary, AnimeListResponse } from './types';

const BASE_URL = 'https://phimapi.com';
const NGUONC_URL = 'https://phim.nguonc.com/api';

export async function getLatestMovies(page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}&limit=10`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error(`[getLatestMovies] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();

        // Extract pagination from KKPhim API: data.params.pagination
        const paginationData = data?.params?.pagination;

        return {
            status: data.status || false,
            items: data.items || [],
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 10
            } : undefined
        };
    } catch (error) {
        console.error('[getLatestMovies] Error:', error);
        return { status: false, items: [] };
    }
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
    try {
        const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=10&page=${page}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            console.error(`[searchMovies] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
        console.log('[searchMovies] Raw API response:', JSON.stringify(data).substring(0, 200));

        // KKPhim search API returns nested structure: { status: true, data: { items: [...], params: { pagination: {...} } } }
        const items = data?.data?.items || data?.data?.data?.items || data?.items || [];
        const paginationData = data?.data?.params?.pagination || data?.params?.pagination;

        return {
            status: data.status || false,
            items: items,
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 10
            } : undefined
        };
    } catch (error) {
        console.error('[searchMovies] Error:', error);
        return { status: false, items: [] };
    }
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
    try {
        const res = await fetch(`${NGUONC_URL}/films/the-loai/hoat-hinh?page=${page}`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error(`[getAnimeList] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data: AnimeListResponse = await res.json();

        // Normalize NguonC data to match our structure
        return {
            status: data.status === 'success',
            items: (data.items || []).map(normalizeNguonCMovie),
            pagination: data.pagination ? {
                currentPage: data.pagination.currentPage || page,
                totalPages: data.pagination.totalPages || 1,
                totalItems: data.pagination.totalItems || 0,
                totalItemsPerPage: 10
            } : undefined
        };
    } catch (error) {
        console.error('[getAnimeList] Error:', error);
        return { status: false, items: [] };
    }
}
