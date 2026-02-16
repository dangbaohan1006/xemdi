import Link from 'next/link';
import Image from 'next/image';
import { MovieSummary } from '@/lib/types';

interface MovieCardProps {
    movie: MovieSummary;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/movie/${movie.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-500/10">
                {/* Poster Image */}
                <div className="relative aspect-[2/3] w-full">
                    <Image
                        src={movie.poster_url.startsWith('http') ? movie.poster_url : `https://phimimg.com/${movie.poster_url}`}
                        alt={movie.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quality Badge */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
                            HD
                        </span>
                    </div>

                    {/* Year */}
                    {movie.year > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-zinc-300 text-[10px] font-medium rounded-md backdrop-blur-sm">
                            {movie.year}
                        </span>
                    )}

                    {/* Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors duration-200">
                        {movie.name}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {movie.origin_name}
                    </p>
                </div>
            </div>
        </Link>
    );
}
