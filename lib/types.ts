// KKPhim API types

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Array<{ id: string; name: string; slug: string }>;
  country: Array<{ id: string; name: string; slug: string }>;
}

export interface Episode {
  server_name: string;
  server_data: Array<{
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }>;
}

export interface MovieSummary {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}

export interface APIResponse {
  status: boolean;
  items: MovieSummary[];
}

export interface LatestMoviesResponse {
  status: boolean;
  items: MovieSummary[];
}

export interface MovieDetailResponse {
  status: boolean;
  movie: Movie;
  episodes: Episode[];
}

// Supabase types
export interface WatchHistory {
  id: string;
  user_id: string;
  movie_slug: string;
  episode_slug: string;
  movie_name: string;
  poster_url: string;
  progress: number;
  duration: number;
  updated_at: string;
}
