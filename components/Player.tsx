'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    MediaPlayer,
    MediaOutlet,
    MediaCommunitySkin,
    useMediaStore,
    useMediaRemote,
    MediaProviderAdapter
} from '@vidstack/react';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Play, AlertCircle, RefreshCw } from 'lucide-react'; // Icon cho đẹp

// Import CSS của Vidstack
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';

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
    poster?: string
}) {
    // Hooks lấy trạng thái player
    const { currentTime, duration, paused, canPlay, started } = useMediaStore();
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
                    // console.log(`[NotFlix] Resumed at ${data.progress}s`);
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

    // Reset state khi đổi tập phim
    useEffect(() => {
        setStreamUrl(src);
        setIsUsingProxy(false);
        setHasError(false);
        setKey(prev => prev + 1); // Reset player instance
    }, [src]);

    // Xử lý khi link .m3u8 lỗi (CORS hoặc 403)
    const handleError = useCallback((detail: any) => {
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

    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
            <MediaPlayer
                key={key} // Force reset khi đổi Url
                src={streamUrl}
                title={title}
                poster={poster}
                aspectRatio={16 / 9}
                crossorigin="" // Quan trọng cho CORS
                onError={handleError}
                className="w-full h-full"
            >
                <MediaOutlet className="w-full h-full" />
                <MediaCommunitySkin />

                {/* Logic ngầm */}
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