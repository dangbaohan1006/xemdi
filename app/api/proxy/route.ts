import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'Referer': 'https://phimapi.com/',
            },
        });

        if (!response.ok) return NextResponse.json({ error: 'Upstream error' }, { status: response.status });

        const contentType = response.headers.get('content-type') || '';

        // CASE 1: Nếu là file M3U8 -> Cần Rewrite URL bên trong
        if (url.endsWith('.m3u8') || contentType.includes('mpegurl') || contentType.includes('text')) {
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
            let body = await response.text();

            // 1. Rewrite các file .ts (segment) thành đường dẫn tuyệt đối
            body = body.replace(/^(?!#)(?!https?:\/\/)(.+\.ts.*)$/gm, `${baseUrl}$1`);

            // 2. Rewrite các file .m3u8 con (nested playlist) để tiếp tục đi qua Proxy
            // Lưu ý: encodeURIComponent để tránh lỗi ký tự đặc biệt
            body = body.replace(
                /^(?!#)(?!https?:\/\/)(.+\.m3u8.*)$/gm,
                (match) => `/api/proxy?url=${encodeURIComponent(baseUrl + match)}`
            );

            return new NextResponse(body, {
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache nhẹ
                },
            });
        }

        // CASE 2: Nếu là file Binary (.ts, .mp4) -> Stream thẳng, không đọc vào RAM
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache lâu với file tĩnh
            },
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}