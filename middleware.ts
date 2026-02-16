import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Tạo response khởi tạo
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('⚠️ [Middleware] Missing Supabase Environment Variables!')
        // Tránh crash nếu thiếu biến môi trường, chỉ log và bỏ qua logic auth
        return NextResponse.next({
            request,
        })
    }

    // 2. Khởi tạo Supabase Client ngay trong Middleware
    // Lưu ý: Không import từ file bên ngoài để tránh lỗi "unsupported modules" trên Edge
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Sync cookie từ Supabase vào Request
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )

                    // Sync cookie từ Supabase vào Response
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

    // 3. Quan trọng: Refresh Session
    // Nếu user F5, dòng này sẽ đảm bảo session được gia hạn và không bị logout
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. (Tùy chọn) Bảo vệ Route - Redirect nếu chưa login
    // Nếu bạn muốn bắt buộc login mới được vào trang /movie, mở comment đoạn dưới:
    /*
    if (!user && request.nextUrl.pathname.startsWith('/movie')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    */

    return supabaseResponse
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