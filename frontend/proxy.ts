import { NextRequest, NextResponse } from "next/server";

function buildResponse(
    body: ReadableStream<Uint8Array> | null,
    status: number,
    backendHeaders: Headers
): NextResponse {
    const res = new NextResponse(body, { status });

    backendHeaders.forEach((value, key) => {
        if (key.toLowerCase() !== 'set-cookie') {
            res.headers.set(key, value);
        }
    });

    const cookies = backendHeaders.getSetCookie();
    cookies.forEach((cookie) => res.headers.append('Set-Cookie', cookie));

    return res;
}

export const proxy = async (request: NextRequest) => {
    const isApi = request.nextUrl.pathname.startsWith('/api');

    if (!isApi) {
        const hasToken = request.cookies.has('access_token');
        if (!hasToken) {
            const refresh = await fetch(`${process.env.API_URL}/auth/refresh`, {
                method: "POST",
                headers: request.headers
            });
            if (!refresh.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            const newCookies = refresh.headers.getSetCookie();
            const response = NextResponse.next();
            newCookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));
            return response;
        }
        return NextResponse.next();
    }

    const endpoint = request.nextUrl.pathname.replace('/api', '');
    const url = `${process.env.API_URL}${endpoint}${request.nextUrl.search}`;

    const requestBody = request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.delete('host');
    forwardHeaders.delete('connection');

    const response = await fetch(url, {
        method: request.method,
        headers: forwardHeaders,
        body: requestBody && requestBody.length > 0 ? requestBody : undefined
    });

    const isAuthEndpoint = endpoint.startsWith('/auth/');

    if (isAuthEndpoint || (response.status !== 401 && response.status !== 403)) {
        return buildResponse(response.body, response.status, response.headers);
    }

    const refresh = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: request.headers
    });

    if (!refresh.ok) {
        return new NextResponse(null, { status: 401 });
    }

    const newCookies = refresh.headers.getSetCookie();
    const retryHeaders = new Headers(request.headers);
    retryHeaders.set('Cookie', newCookies.join('; '));

    const retryResponse = await fetch(url, {
        method: request.method,
        headers: retryHeaders,
        body: requestBody && requestBody.length > 0 ? requestBody : undefined
    });

    const finalResponse = buildResponse(
        retryResponse.body,
        retryResponse.status,
        retryResponse.headers
    );

    newCookies.forEach((cookie) => {
        finalResponse.headers.append('Set-Cookie', cookie);
    });

    return finalResponse;
};

export const config = {
    matcher: ["/api/:path*", "/book"],
};