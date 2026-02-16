'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    MediaPlayer,
    MediaProvider,
    useMediaStore,
    useMediaRemote,
    type MediaPlayerInstance,
    type MediaErrorDetail
} from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { AlertCircle, RefreshCw } from 'lucide-react';

// Import Vidstack v1.x CSS
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface PlayerProps {
    src: string;        // Link .m3u8 gốc
    title: string;      // Tiêu đề phim để hiển thị
    poster?: string;    // Ảnh bìa
    movieSlug: string;  // ID phim (dùng làm khóa chính lưu DB)
    episodeSlug?: string; // ID tập phim (để biết đang xem tập nào)
}

/**
 * Component con không giao diện (Headless)
 * Nhiệm vụ: Xử lý logic Sync Database và Restore tiến độ
 * Lý do tách ra: Để sử dụng được hooks của Vidstack (useMediaStore) nằm trong context của MediaPlayer
 */
function PlayerLogic({
    movieSlug,
    episodeSlug = 'tap-1', // Mặc định nếu là phim lẻ
    title,
    poster
}: {
    movieSlug: string;
    episodeSlug?: string;
    title: string;
    poster?: string;
}) {
    // Hooks lấy trạng thái player
    const { currentTime, duration, canPlay, started } = useMediaStore();
    // Hook điều khiển player (seek, play, pause)
    const remote = useMediaRemote();

    // Refs để giữ giá trị giữa các lần render mà không gây re-render
    const userIdRef = useRef<string | null>(null);
    const lastSaveTimeRef = useRef(0);
    const hasRestoredRef = useRef(false);
    const isUserLoadedRef = useRef(false);

    // 1. Lấy User ID NGAY KHI MOUNT (Chỉ chạy 1 lần)
    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                userIdRef.current = data.user.id;
                isUserLoadedRef.current = true;
            }
        }
        getUser();
    }, []);

    // 2. Restore playback (Tự động tua đến đoạn cũ)
    useEffect(() => {
        // Chỉ chạy khi: Video đã load (canPlay), chưa restore lần nào, và đã có UserID
        if (!canPlay || hasRestoredRef.current || !userIdRef.current) return;

        async function restoreHistory() {
            try {
                const { data } = await supabase
                    .from('watch_history')
                    .select('progress')
                    .eq('user_id', userIdRef.current)
                    .eq('movie_slug', movieSlug)
                    .maybeSingle(); // Dùng maybeSingle để không lỗi nếu chưa có history

                if (data && data.progress > 5) { // Chỉ tua nếu đã xem quá 5 giây
                    remote.seek(data.progress);
                    hasRestoredRef.current = true;
                    console.log(`[Player] Resumed at ${data.progress}s`);
                }
            } catch (error) {
                console.error('Error restoring history:', error);
            }
        }

        // Delay nhẹ 500ms để player ổn định trước khi seek
        const timeout = setTimeout(restoreHistory, 500);
        return () => clearTimeout(timeout);
    }, [canPlay, movieSlug, remote]);

    // 3. Sync Progress lên Supabase (Debounce 5 giây)
    useEffect(() => {
        if (!started || !userIdRef.current || currentTime < 5) return;

        const now = Date.now();
        // Chỉ lưu nếu lần lưu cuối cách đây > 5s (Tránh spam DB)
        if (now - lastSaveTimeRef.current < 5000) return;

        lastSaveTimeRef.current = now;

        const saveData = async () => {
            await supabase.from('watch_history').upsert({
                user_id: userIdRef.current,
                movie_slug: movieSlug,
                episode_slug: episodeSlug,
                movie_name: title,
                poster_url: poster,
                progress: Math.floor(currentTime),
                duration: Math.floor(duration),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,movie_slug' // Quan trọng: Update nếu đã tồn tại
            });
        };

        saveData();

    }, [currentTime, duration, started, movieSlug, episodeSlug, title, poster]);

    return null; // Component này không render gì cả
}

/**
 * Component hiển thị chính
 */
export default function Player({ src, title, poster, movieSlug, episodeSlug }: PlayerProps) {
    const [streamUrl, setStreamUrl] = useState(src);
    const [isUsingProxy, setIsUsingProxy] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(0); // Dùng để Force re-render player khi đổi source
    const playerRef = useRef<MediaPlayerInstance>(null);

    // Reset state khi đổi tập phim
    useEffect(() => {
        setStreamUrl(src);
        setIsUsingProxy(false);
        setHasError(false);
        setKey(prev => prev + 1); // Reset player instance
    }, [src]);

    // Xử lý khi link .m3u8 lỗi (CORS hoặc 403)
    const handleError = useCallback((detail: MediaErrorDetail) => {
        // Nếu đang dùng link gốc mà lỗi -> Chuyển sang Proxy
        if (!isUsingProxy) {
            console.warn('[Player] Direct stream failed, switching to Proxy...');
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(src)}`;
            setStreamUrl(proxyUrl);
            setIsUsingProxy(true);
            setKey(prev => prev + 1); // Reload player với link mới
        } else {
            // Nếu đã dùng Proxy mà vẫn lỗi -> Game Over
            console.error('[Player] Stream failed permanently', detail);
            setHasError(true);
        }
    }, [isUsingProxy, src]);

    if (hasError) {
        return (
            <div className="w-full aspect-video bg-zinc-950 rounded-xl flex flex-col items-center justify-center border border-zinc-800">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-zinc-400 font-medium">Không thể tải video</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-white flex items-center gap-2 transition"
                >
                    <RefreshCw size={16} /> Thử tải lại
                </button>
            </div>
        );
    }

    const [isHDR, setIsHDR] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const toastTimeoutRef = useRef<NodeJS.Timeout>(null);

    const toggleHDR = () => {
        const newState = !isHDR;
        setIsHDR(newState);

        // Show toast
        if (newState) {
            setToastMsg('Đã bật chế độ HDR giả lập');
        } else {
            setToastMsg('Đã tắt chế độ HDR');
        }

        // Clear previous timeout
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

        // Set new timeout
        toastTimeoutRef.current = setTimeout(() => {
            setToastMsg(null);
        }, 2000);
    };

    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
            <MediaPlayer
                key={key} // Force reset khi đổi Url
                ref={playerRef}
                src={streamUrl}
                title={title}
                poster={poster}
                aspectRatio="16/9"
                load="eager"
                crossOrigin
                onError={(detail) => handleError(detail as MediaErrorDetail)}
                className="w-full h-full"
                style={isHDR ? { filter: 'contrast(1.1) saturate(1.2) brightness(1.05)' } : undefined}
            >
                <MediaProvider />

                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                    thumbnails={poster}
                    slots={{
                        googleCastButton: null, // Hide Google Cast button
                    }}
                />

                {/* Custom HDR Button Overlay */}
                <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={toggleHDR}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${isHDR
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                                : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10'
                            }`}
                        title={isHDR ? "Tắt HDR" : "Bật HDR giả lập"}
                    >
                        {/* Sparkles icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={isHDR ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            <path d="M5 3v4" />
                            <path d="M9 17v4" />
                            <path d="M3 21h6" />
                        </svg>
                    </button>
                </div>

                {/* Toast Notification */}
                <div className={`absolute top-16 right-4 z-50 pointer-events-none transition-all duration-300 transform ${toastMsg ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                    }`}>
                    <div className="bg-black/80 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/10 shadow-xl flex items-center gap-2">
                        <span className="text-yellow-400">✨</span>
                        {toastMsg}
                    </div>
                </div>

                {/* Logic ngầm - Watch history sync */}
                <PlayerLogic
                    movieSlug={movieSlug}
                    episodeSlug={episodeSlug}
                    title={title}
                    poster={poster}
                />
            </MediaPlayer>
        </div>
    );
}