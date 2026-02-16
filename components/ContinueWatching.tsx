'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { WatchHistory } from '@/lib/types';
const supabase = createClient();

export default function ContinueWatching() {
    const [history, setHistory] = useState<WatchHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            setIsLoggedIn(true);

            const { data, error } = await supabase
                .from('watch_history')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setHistory(data);
            }
            setLoading(false);
        }

        fetchHistory();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchHistory();
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <section className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4">Tiếp tục xem</h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-44 animate-pulse">
                            <div className="aspect-[2/3] bg-zinc-800 rounded-lg" />
                            <div className="h-3 bg-zinc-800 rounded mt-2 w-3/4" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!isLoggedIn || history.length === 0) {
        return null;
    }

    return (
        <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                Tiếp tục xem
            </h2>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {history.map((item) => {
                    const progressPercent = item.duration > 0
                        ? Math.min((item.progress / item.duration) * 100, 100)
                        : 0;

                    return (
                        <Link
                            key={item.id}
                            href={`/movie/${item.movie_slug}`}
                            className="flex-shrink-0 w-40 group"
                        >
                            <div className="relative overflow-hidden rounded-lg bg-zinc-900 transition-transform duration-300 group-hover:scale-105">
                                <div className="relative aspect-[2/3] w-full">
                                    <Image
                                        src={item.poster_url && item.poster_url.startsWith('http') ? item.poster_url : `https://phimimg.com/${item.poster_url || ''}`}
                                        alt={item.movie_name}
                                        fill
                                        className="object-cover"
                                        sizes="160px"
                                        unoptimized
                                    />

                                    {/* Play icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                                    <div
                                        className="h-full bg-red-600 transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>

                            <h3 className="mt-2 text-xs font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                                {item.movie_name}
                            </h3>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
