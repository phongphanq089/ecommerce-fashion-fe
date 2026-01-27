// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { API_BASE_URL } from './lib/api-client'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  console.log(
    `---> [Middleware] Request tới: ${path} | Session: ${
      sessionToken ? 'CÓ' : 'KHÔNG'
    }`,
  )

  // 1. Nếu vào trang Sign-in mà đã có Token -> Về trang chủ
  if (path === '/auth/sign-in' && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  // 2. Kiểm tra các vùng bảo vệ
  const isProtectedRoute =
    path.startsWith('/dashboard') || path.startsWith('/admin')

  // 2. CHẶN PHÂN QUYỀN (USER vs ADMIN)
  if (isProtectedRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-session`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: `better-auth.session_token=${sessionToken}` || '',
        },
      })

      const sessionData = await response.json()
      const role = sessionData?.user?.role

      // LOGIN PHÂN QUYỀN
      if (path.startsWith('/admin')) {
        // chỉ admin và super admin mới được vào
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
          return NextResponse.redirect(new URL('/error-403', request.url))
        }
      }
      // Bạn có thể thêm các vùng chỉ dành riêng cho SUPER-ADMIN ở đây
      if (path.startsWith('/admin/system-settings') && role !== 'SUPER-ADMIN') {
        return NextResponse.redirect(new URL('/error-403', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 1. Áp dụng cho các route cụ thể mà bạn đang xử lý logic:
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/sign-in',
    '/api/proxy/:path*',
    /*
     * 2. Loại trừ các file hệ thống để tăng tốc độ tải trang (Optional nhưng nên dùng):
     * Đoạn regex dưới đây giúp Middleware KHÔNG chạy vào:
     * - _next/static (file js/css tĩnh)
     * - _next/image (ảnh tối ưu)
     * - favicon.ico (icon trình duyệt)
     * - public (các file trong thư mục public như robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
