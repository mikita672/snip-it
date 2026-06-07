import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    if (cookieStore.has('access_token')) {
        redirect('/');
    }

    return (
        <>
            {children}
        </>
    );
}
