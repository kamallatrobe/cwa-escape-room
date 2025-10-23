import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const t0 = Date.now();
  const ua = req.headers.get('user-agent') || 'unknown';
  console.log(`[MW] ${req.method} ${req.nextUrl.pathname} ua=${ua}`);

  const res = NextResponse.next();
  res.headers.set('x-start-time', String(t0));
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
