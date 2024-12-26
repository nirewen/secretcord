import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const cookieStore = await cookies()

  if (!url.pathname.startsWith('/api/auth') && cookieStore.has('currentURL')) {
    const currentURL = cookieStore.get('currentURL')?.value as string

    cookieStore.delete('currentURL')

    return NextResponse.redirect(currentURL)
  }

  if (url.pathname.startsWith('/api/auth/sign-in/social') && url.searchParams.has('currentURL')) {
    cookieStore.set('currentURL', url.searchParams.get('currentURL') as string)
  }

  return NextResponse.next()
}
