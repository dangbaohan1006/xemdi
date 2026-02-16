import { getMovieBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Player from '@/components/Player';
import EpisodeSelector from '@/components/EpisodeSelector';
import type { Metadata } from 'next';
import Image from 'next/image';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ ep?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const data = await getMovieBySlug(slug);
        return {
            title: `${data.movie.name} — XemĐi`,
            description: data.movie.content?.slice(0, 160) || `Xem ${data.movie.name} online miễn phí`,
        };
    } catch {
        return { title: 'Phim — XemĐi' };
    }
}

export default async function WatchPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { ep } = await searchParams;

    let data;
    try {
        data = await getMovieBySlug(slug);
    } catch (e) {
        console.error('Failed to fetch movie:', e);
        notFound();
    }

    if (!data?.movie) {
        notFound();
    }

    const { movie, episodes } = data;

    // Find the current episode's m3u8 link
    const selectedEpSlug = ep || episodes?.[0]?.server_data?.[0]?.slug || '';
    let currentLink = '';
    let currentEpName = '';

    for (const server of episodes) {
        for (const epData of server.server_data) {
            if (epData.slug === selectedEpSlug || (!ep && server.server_data.indexOf(epData) === 0)) {
                currentLink = epData.link_m3u8;
                currentEpName = epData.name;
                break;
            }
        }
        if (currentLink) break;
    }

    // Fallback to first episode
    if (!currentLink && episodes?.[0]?.server_data?.[0]) {
        currentLink = episodes[0].server_data[0].link_m3u8;
        currentEpName = episodes[0].server_data[0].name;
    }

    const posterUrl = movie.poster_url.startsWith('http')
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`;

    const thumbUrl = movie.thumb_url.startsWith('http')
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Player */}
            <div className="animate-fade-in">
                {currentLink ? (
                    <Player
                        src={currentLink}
                        title={`${movie.name}${currentEpName && currentEpName !== 'Full' ? ` - ${currentEpName}` : ''}`}
                        poster={thumbUrl}
                        movieSlug={movie.slug}
                        episodeSlug={selectedEpSlug}
                    />
                ) : (
                    <div className="w-full aspect-video bg-zinc-900 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                            </svg>
                            <p className="text-zinc-500">Không tìm thấy nguồn phát.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Episode Selector */}
            {episodes?.[0]?.server_data?.length > 1 && (
                <div className="mt-6 animate-slide-up">
                    <EpisodeSelector
                        episodes={episodes}
                        currentSlug={selectedEpSlug}
                        movieSlug={movie.slug}
                    />
                </div>
            )}

            {/* Movie Info */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-white">{movie.name}</h1>
                        <p className="text-lg text-zinc-400 mt-1">{movie.origin_name}</p>
                    </div>

                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-2">
                        {movie.quality && (
                            <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full border border-red-600/30">
                                {movie.quality}
                            </span>
                        )}
                        {movie.lang && (
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full border border-blue-600/30">
                                {movie.lang}
                            </span>
                        )}
                        {movie.year > 0 && (
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700">
                                {movie.year}
                            </span>
                        )}
                        {movie.time && (
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700">
                                ⏱ {movie.time}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700">
                            {movie.episode_current}/{movie.episode_total || '?'} tập
                        </span>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        {movie.category?.map((cat: { id: string; name: string }) => (
                            <span
                                key={cat.id}
                                className="px-3 py-1 bg-zinc-800/50 text-zinc-400 text-xs rounded-full border border-zinc-700/50 hover:border-red-500/50 hover:text-red-400 transition-colors cursor-default"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    {/* Synopsis */}
                    {movie.content && (
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Nội dung phim</h3>
                            <p
                                className="text-zinc-400 text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: movie.content }}
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                    {/* Poster */}
                    <div className="hidden lg:block rounded-xl overflow-hidden relative aspect-[2/3]">
                        <Image
                            src={posterUrl}
                            alt={movie.name}
                            fill
                            className="object-cover rounded-xl"
                            sizes="(max-width: 1024px) 0px, 300px"
                        />
                    </div>

                    {/* Cast */}
                    {movie.actor?.length > 0 && (
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Diễn viên</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {movie.actor.slice(0, 10).map((name: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Director */}
                    {movie.director?.length > 0 && (
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Đạo diễn</h3>
                            <p className="text-zinc-400 text-sm">{movie.director.join(', ')}</p>
                        </div>
                    )}

                    {/* Country */}
                    {movie.country?.length > 0 && (
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Quốc gia</h3>
                            <p className="text-zinc-400 text-sm">{movie.country.map((c: { name: string }) => c.name).join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
