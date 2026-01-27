// app/api/proxy/login/route.ts
import { NextResponse } from 'next/server'
import { API_BASE_URL } from '~/lib/api-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const origin = request.headers.get('origin') || ''

    const backendRes = await fetch(`${API_BASE_URL}/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: JSON.stringify(body),
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

    const setCookieHeader = backendRes.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }

    return response
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Proxy' }, { status: 500 })
  }
}
