'use client';

import Link from 'next/link';
import { Episode as EpisodeServer } from '@/lib/types';

interface EpisodeSelectorProps {
    episodes: EpisodeServer[];
    currentSlug: string;
    movieSlug: string;
}

export default function EpisodeSelector({ episodes, currentSlug, movieSlug }: EpisodeSelectorProps) {
    return (
        <div className="glass rounded-xl p-5">
            {episodes.map((server, serverIdx) => (
                <div key={serverIdx} className={serverIdx > 0 ? 'mt-6' : ''}>
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                        {server.server_name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {server.server_data.map((ep) => {
                            const isActive = ep.slug === currentSlug;
                            return (
                                <Link
                                    key={ep.slug}
                                    href={`/movie/${movieSlug}?ep=${ep.slug}`}
                                    className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                        }
                  `}
                                >
                                    {ep.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
