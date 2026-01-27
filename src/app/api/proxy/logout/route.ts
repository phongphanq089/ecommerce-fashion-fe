import { NextResponse } from 'next/server'
import { API_BASE_URL } from '~/lib/api-client'

export async function POST(request: Request) {
  try {
    const sessionToken = request.headers.get('cookie') || ''
    // 1. Gọi sang Backend Fastify để xóa session trên DB
    const origin = request.headers.get('origin') || ''
    const backendRes = await fetch(`${API_BASE_URL}/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionToken,
        origin: origin,
      },
      body: JSON.stringify({}),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json({
        success: data.success,
        message: data.message || 'Error Backend',
        error: data.error || 'Bad Request',
        result: data.result,
      })
    }

    const response = NextResponse.json(data, { status: 200 })
    // 2. Xóa Cookie ở phía Client (Next.js Side)
    // Cách 1: Chuyển tiếp set-cookie từ BE nếu BE có trả về lệnh xóa
    const setCookieHeader = backendRes.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    } else {
      // Cách 2: Tự ghi đè cookie để trình duyệt xóa ngay lập tức nếu BE không gửi
      response.cookies.set('better-auth.session_token', '', {
        path: '/',
        expires: new Date(0),
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Proxy Logout' }, { status: 500 })
  }
}
