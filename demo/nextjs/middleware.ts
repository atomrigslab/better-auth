import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const cookies = getSessionCookie(request);
    
    // 보호된 경로에 대한 접근 제어
    if (request.nextUrl.pathname.startsWith('/account-profile') && !cookies) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname.startsWith('/sign-in-success') && !cookies) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    // 로그인된 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉트
    if (request.nextUrl.pathname === '/sign-in' && cookies) {
        return NextResponse.redirect(new URL("/account-profile", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/account-profile/:path*", "/sign-in-success/:path*", "/sign-in"],
};