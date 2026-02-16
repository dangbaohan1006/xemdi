import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Tạm thời return trực tiếp để bypass lỗi __dirname
    // Web sẽ vào được bình thường, nhưng session sẽ không tự refresh (chấp nhận được với quy mô nhỏ)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}