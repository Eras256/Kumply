import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Clear the accept-language header so next-intl ignores browser language
  // and falls back to defaultLocale (en), while still respecting the NEXT_LOCALE cookie.
  request.headers.set('accept-language', '');
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/((?!api|pitch|_next|_vercel|.*\\..*).*)']
};
