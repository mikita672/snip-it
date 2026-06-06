import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
    const endpoint = request.nextUrl.pathname.replace('/api', '');
    const url = `${process.env.API_URL}${endpoint}`;
    const method = request.method;
    const headers = request.headers;
    const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

    const response = await fetch(url, { method, headers, body });
    if (response.status !== 401) {
        return NextResponse.json(await response.json(), { status: response.status });
    }

    const refreshResponse = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: "POST",
        headers,
    });
    if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    const newCookies = refreshResponse.headers.getSetCookie();
    const retryHeaders = new Headers(headers);
    retryHeaders.set('Cookie', newCookies.join(';'));

    const retryResponse = await fetch(url, {
        method,
        headers: retryHeaders,
        body,
    });

    const finalResponse = NextResponse.json(
        await retryResponse.json(), {
        status: retryResponse.status,
    });

    newCookies.forEach((cookie) => {
        finalResponse.headers.append('Set-Cookie', cookie)
    });

    return finalResponse;
};

export const config = {
    matcher: "/api/:path*",
};