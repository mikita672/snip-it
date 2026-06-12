import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
    const endpoint = request.nextUrl.pathname.replace('/api', '');
    const url = `${process.env.API_URL}${endpoint}${request.nextUrl.search}`;

    const requestBody = request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const response = await fetch(url, {
        method: request.method,
        headers: request.headers,
        body: requestBody
    });

    if (response.status !== 401) {
        return new NextResponse(response.body, {
            status: response.status,
            headers: new Headers(response.headers),
        });
    }

    const refresh = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: request.headers
    });

    if (!refresh.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const newCookies = refresh.headers.getSetCookie();
    const retryHeaders = new Headers(request.headers);
    retryHeaders.set('Cookie', newCookies.join('; '));

    const retryResponse = await fetch(url, {
        method: request.method,
        headers: retryHeaders,
        body: requestBody
    });

    const finalResponse = new NextResponse(retryResponse.body, {
        status: retryResponse.status,
        headers: new Headers(retryResponse.headers),
    });

    newCookies.forEach((cookie) => {
        finalResponse.headers.append('Set-Cookie', cookie);
    });

    return finalResponse;
};

export const config = {
    matcher: "/api/:path*",
};