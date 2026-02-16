import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware' // Chúng ta sẽ tạo file này ngay dưới

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Áp dụng middleware cho mọi request TRỪ các file tĩnh, ảnh, favicon...
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}