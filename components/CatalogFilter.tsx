'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { GENRES, COUNTRIES, YEARS } from '@/lib/api';

export default function CatalogFilter() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return false; // Don't highlight for homepage unless specifically there?
        return pathname === path || pathname?.startsWith(path + '/');
    };

    const types = [
        { name: 'Phim Lẻ', href: '/phim-le' },
        { name: 'Phim Bộ', href: '/phim-bo' },
        { name: 'TV Shows', href: '/tv-shows' },
        { name: 'Anime', href: '/anime' },
        { name: 'Chiếu Rạp', href: '/chieu-rap' }, // Kept as option but hidden from nav
    ];

    return (
        <div className="relative mb-8">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isOpen
                        ? 'bg-yellow-500 text-black font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    <span>Bộ lọc</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                    {/* Types */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Loại phim</h3>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/search"
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent ${pathname === '/search' || pathname === '/duyet-tim'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50'
                                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                Tất cả
                            </Link>
                            {types.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent ${startDateMatch(pathname, item.href)
                                        ? 'bg-yellow-500 text-black font-medium shadow-lg shadow-yellow-500/20'
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Thể loại</h3>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map((item) => {
                                const href = `/the-loai/${item.slug}`;
                                return (
                                    <Link
                                        key={item.slug}
                                        href={href}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent ${isActive(href)
                                            ? 'bg-yellow-500 text-black font-medium shadow-lg shadow-yellow-500/20'
                                            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Quốc gia</h3>
                        <div className="flex flex-wrap gap-2">
                            {COUNTRIES.map((item) => {
                                const href = `/quoc-gia/${item.slug}`;
                                return (
                                    <Link
                                        key={item.slug}
                                        href={href}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent ${isActive(href)
                                            ? 'bg-yellow-500 text-black font-medium shadow-lg shadow-yellow-500/20'
                                            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Years */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Năm phát hành</h3>
                        <div className="flex flex-wrap gap-2">
                            {YEARS.map((year) => {
                                const href = `/nam/${year}`;
                                return (
                                    <Link
                                        key={year}
                                        href={href}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent ${pathname === href
                                            ? 'bg-yellow-500 text-black font-medium shadow-lg shadow-yellow-500/20'
                                            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                                            }`}
                                    >
                                        {year}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function startDateMatch(pathname: string, href: string) {
    if (href === '/phim-le' && pathname === '/phim-le') return true;
    if (href === '/phim-bo' && pathname === '/phim-bo') return true;
    if (href === '/tv-shows' && pathname === '/tv-shows') return true;
    if (href === '/anime' && pathname === '/anime') return true;
    if (href === '/chieu-rap' && pathname === '/chieu-rap') return true;
    return false;
}
