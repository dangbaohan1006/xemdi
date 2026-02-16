import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Safe Mode: Kiểm tra Env Vars trước
    // Nếu thiếu biến môi trường, log cảnh báo và cho qua (để không bị lỗi 500)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ [Middleware] Missing Supabase Env Vars. Auth logic skipped.')
        return NextResponse.next()
    }

    try {
        // 2. Tạo response khởi tạo
        let supabaseResponse = NextResponse.next({
            request,
        })

        // 3. Khởi tạo Supabase Client (Logic gộp từ lib/supabase/middleware cũ)
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // 4. Refresh Session (Quan trọng để giữ đăng nhập)
        await supabase.auth.getUser()

        return supabaseResponse

    } catch (e) {
        // Catch-all: Nếu có lỗi bất ngờ, log ra và vẫn cho user vào web
        console.error('❌ [Middleware Error]', e)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match tất cả request paths ngoại trừ:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Các file ảnh/tài nguyên tĩnh (svg, png, jpg...)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}