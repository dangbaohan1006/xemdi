import { LatestMoviesResponse as MovieListResponse, MovieDetailResponse, MovieSummary, AnimeListResponse } from './types';

const BASE_URL = 'https://phimapi.com';
const NGUONC_URL = 'https://phim.nguonc.com/api';

export async function getLatestMovies(page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}&limit=10`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[getLatestMovies] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
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
        next: { revalidate: 3600 },
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

function normalizeNguonCMovie(nguoncMovie: any): MovieSummary {
    return {
        _id: nguoncMovie._id || nguoncMovie.id || '',
        name: nguoncMovie.name || '',
        slug: nguoncMovie.slug || '',
        origin_name: nguoncMovie.origin_name || nguoncMovie.original_name || '',
        poster_url: nguoncMovie.thumb_url || nguoncMovie.poster_url || '',
        thumb_url: nguoncMovie.thumb_url || nguoncMovie.poster_url || '',
        year: nguoncMovie.year || new Date().getFullYear(),
    };
}

export async function getAnimeList(page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/v1/api/danh-sach/hoat-hinh?page=${page}&limit=10`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[getAnimeList] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
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
        console.error('[getAnimeList] Error:', error);
        return { status: false, items: [] };
    }
}

export async function getTvShows(page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/v1/api/danh-sach/tv-shows?page=${page}&limit=18`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[getTvShows] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
        const paginationData = data?.params?.pagination;

        return {
            status: data.status || false,
            items: data.items || [],
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 18
            } : undefined
        };
    } catch (error) {
        console.error('[getTvShows] Error:', error);
        return { status: false, items: [] };
    }
}

export async function getCinemaMovies(page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-chieu-rap?page=${page}&limit=18`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[getCinemaMovies] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
        const paginationData = data?.params?.pagination;

        return {
            status: data.status || false,
            items: data.items || [],
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 18
            } : undefined
        };
    } catch (error) {
        console.error('[getCinemaMovies] Error:', error);
        return { status: false, items: [] };
    }
}

export async function getMoviesByYear(year: number, page: number = 1): Promise<MovieListResponse> {
    try {
        const res = await fetch(`${BASE_URL}/v1/api/nam/${year}?page=${page}&limit=18`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error(`[getMoviesByYear] HTTP ${res.status}`);
            return { status: false, items: [] };
        }

        const data = await res.json();
        const paginationData = data?.params?.pagination;

        return {
            status: data.status || false,
            items: data.items || [],
            pagination: paginationData ? {
                currentPage: paginationData.currentPage || page,
                totalPages: paginationData.totalPages || 1,
                totalItems: paginationData.totalItems || 0,
                totalItemsPerPage: 18
            } : undefined
        };
    } catch (error) {
        console.error('[getMoviesByYear] Error:', error);
        return { status: false, items: [] };
    }
}

export const GENRES = [
    { name: 'Hành Động', slug: 'hanh-dong' },
    { name: 'Tình Cảm', slug: 'tinh-cam' },
    { name: 'Hài Hước', slug: 'hai-huoc' },
    { name: 'Cổ Trang', slug: 'co-trang' },
    { name: 'Tâm Lý', slug: 'tam-ly' },
    { name: 'Hình Sự', slug: 'hinh-su' },
    { name: 'Chiến Tranh', slug: 'chien-tranh' },
    { name: 'Thể Thao', slug: 'the-thao' },
    { name: 'Võ Thuật', slug: 'vo-thuat' },
    { name: 'Viễn Tưởng', slug: 'vien-tuong' },
    { name: 'Phiêu Lưu', slug: 'phieu-luu' },
    { name: 'Khoa Học', slug: 'khoa-hoc' },
    { name: 'Kinh Dị', slug: 'kinh-di' },
    { name: 'Âm Nhạc', slug: 'am-nhac' },
    { name: 'Gia Đình', slug: 'gia-dinh' },
    { name: 'Học Đường', slug: 'hoc-duong' },
];

export const COUNTRIES = [
    { name: 'Âu Mỹ', slug: 'au-my' },
    { name: 'Hàn Quốc', slug: 'han-quoc' },
    { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Nhật Bản', slug: 'nhat-ban' },
    { name: 'Thái Lan', slug: 'thai-lan' },
    { name: 'Việt Nam', slug: 'viet-nam' },
    { name: 'Ấn Độ', slug: 'an-do' },
    { name: 'Anh', slug: 'anh' },
];

export const YEARS = Array.from(
    { length: new Date().getFullYear() - 1989 },
    (_, i) => new Date().getFullYear() - i
);
