import { cookies } from "next/headers";

export default async function TestPage() {
    const cookieStore = await cookies();
    try {
        cookieStore.set("test_cookie", "test_value");
        return <div>Success</div>;
    } catch (e: any) {
        return <div>Error: {e.message}</div>;
    }
}
