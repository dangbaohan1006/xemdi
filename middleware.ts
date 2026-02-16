import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Tạo Response khởi tạo
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. Kiểm tra biến môi trường (Safety check)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        // Nếu thiếu Env Var, chỉ return response rỗng để web không sập
        return supabaseResponse
    }

    try {
        // 3. Khởi tạo Client với logic xử lý Cookie tối giản nhất
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        // Cập nhật cookie vào Request (để Server Component đọc được ngay)
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )

                        // Tạo lại Response để apply cookie mới
                        supabaseResponse = NextResponse.next({
                            request,
                        })

                        // Cập nhật cookie vào Response (để Browser lưu lại)
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // 4. Quan trọng: Lấy User để refresh token
        // Lưu ý: Dùng getUser() thay vì getSession() để bảo mật hơn
        await supabase.auth.getUser()

        return supabaseResponse

    } catch (e) {
        // Nếu có lỗi bất kỳ, return response gốc để người dùng vẫn vào được web
        console.error('Middleware Error:', e)
        return NextResponse.next({
            request,
        })
    }
}

export const config = {
    matcher: [
        // Loại trừ các file tĩnh
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}