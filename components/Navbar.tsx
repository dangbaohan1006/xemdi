'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, ChevronDown } from 'lucide-react';
import SearchInput from './SearchInput';
import { GENRES, COUNTRIES, YEARS } from '@/lib/api';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Load user
    useEffect(() => {
        const supabase = createClient();
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) setUser(data.user);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setMenuOpen(false);
        window.location.href = '/';
    };

    const mainLinks = [
        { name: 'Duyệt Tìm', href: '/search' },
        { name: 'Phim Bộ', href: '/phim-bo' },
        { name: 'Phim Lẻ', href: '/phim-le' },
        { name: 'TV Shows', href: '/tv-shows' },
        { name: 'Hoạt Hình', href: '/anime' },
        { name: 'Chiếu Rạp', href: '/chieu-rap' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                            <span className="text-white font-black text-lg">X</span>
                        </div>
                        <span className="text-xl font-black gradient-text hidden sm:inline">XemĐi</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                                    ? 'text-red-500'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Genres Dropdown */}
                        <div className="relative group">
                            <button className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg flex items-center gap-1 transition-colors">
                                Thể Loại <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-96 bg-zinc-900/95 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                                <div className="grid grid-cols-4 gap-2">
                                    {GENRES.map((genre) => (
                                        <Link
                                            key={genre.slug}
                                            href={`/the-loai/${genre.slug}`}
                                            className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Countries Dropdown */}
                        <div className="relative group">
                            <button className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg flex items-center gap-1 transition-colors">
                                Quốc Gia <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-72 bg-zinc-900/95 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {COUNTRIES.map((country) => (
                                        <Link
                                            key={country.slug}
                                            href={`/quoc-gia/${country.slug}`}
                                            className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-center"
                                        >
                                            {country.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Years Dropdown */}
                        <div className="relative group">
                            <button className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg flex items-center gap-1 transition-colors">
                                Năm <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full right-0 mt-1 w-80 bg-zinc-900/95 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-5 gap-2">
                                    {YEARS.map((year) => (
                                        <Link
                                            key={year}
                                            href={`/nam/${year}`}
                                            className="px-2 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-center"
                                        >
                                            {year}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <SearchInput />
                        </div>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                                Đăng nhập
                            </Link>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-zinc-300 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-zinc-900 border-t border-zinc-800">
                    <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Search */}
                        <div className="mb-4">
                            <SearchInput />
                        </div>

                        {/* Main Links */}
                        {mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                                    ? 'text-red-500 bg-zinc-800'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Accordions */}
                        <MobileAccordion title="Thể Loại" items={GENRES.map(g => ({ name: g.name, href: `/the-loai/${g.slug}` }))} onClose={() => setMobileMenuOpen(false)} />
                        <MobileAccordion title="Quốc Gia" items={COUNTRIES.map(c => ({ name: c.name, href: `/quoc-gia/${c.slug}` }))} onClose={() => setMobileMenuOpen(false)} />
                        <MobileAccordion title="Năm" items={YEARS.map(y => ({ name: String(y), href: `/nam/${y}` }))} onClose={() => setMobileMenuOpen(false)} />
                    </div>
                </div>
            )}
        </nav>
    );
}

function MobileAccordion({ title, items, onClose }: { title: string; items: { name: string; href: string }[]; onClose: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
                {title}
                <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="mt-1 pl-4 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
