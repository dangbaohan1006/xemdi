import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    try {
        // 1. Tạo response khởi tạo
        let supabaseResponse = NextResponse.next({
            request,
        })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('⚠️ [Middleware] Missing Supabase Environment Variables!')
            return NextResponse.next({
                request,
            })
        }

        // 2. Khởi tạo Supabase Client
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

        // 3. Refresh Session
        await supabase.auth.getUser()

        return supabaseResponse
    } catch (e) {
        // Catch all errors to prevent 500
        console.error('⚠️ [Middleware] Error:', e)
        return NextResponse.next({
            request,
        })
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