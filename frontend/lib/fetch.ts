import { cookies } from "next/headers";

export const serverFetch = async (endpoint: string, options: RequestInit = {}) => {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const targetUrl = `${baseUrl}${endpoint}`;

    const headers = new Headers(options.headers);
    if (cookieString) {
        headers.set("Cookie", cookieString);
    }

    return fetch(targetUrl, {
        ...options,
        headers,
    });
};