import AppointmentsTable from '@/components/appointments/AppointmentsTable'
import { UserReservationsPage } from '@/types/reservation/UserReservationPreview'
import { serverFetch } from '@/lib/fetch'
import { Bodoni_Moda } from 'next/font/google'
import { redirect } from 'next/navigation'

const bodoni = Bodoni_Moda({
	subsets: ['latin'],
	weight: '400',
});

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function AppointmentsPage({ searchParams }: Props) {
    const paramsObj = await searchParams;
    const page = paramsObj.page ? parseInt(paramsObj.page as string) : 0;
    const size = paramsObj.size ? parseInt(paramsObj.size as string) : 5;
    const sort = paramsObj.sort ? (paramsObj.sort as string) : 'reservationTime';
    const direction = paramsObj.direction ? (paramsObj.direction as string) : 'desc';
    const search = paramsObj.search ? (paramsObj.search as string) : '';
    const status = paramsObj.status ? (paramsObj.status as string) : '';

    let url = `/api/reservation/my-appointments?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    if (status) {
        url += `&status=${encodeURIComponent(status)}`;
    }

    const response = await serverFetch(url, {
        method: 'GET',
    });

    if (response.status === 401) {
        redirect('/login');
    }

    if (!response.ok) {
        console.error('Fetch failed:', response.status, response.statusText);
        try {
            const errorText = await response.text();
            console.error('Error body:', errorText);
        } catch (e) {}
        return (
            <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
                <p className="text-center font-bold text-destructive">Failed to load appointments ({response.status})</p>
            </div>
        );
    }

    const data: UserReservationsPage = await response.json();

    return (
        <div className="flex flex-col gap-8 md:px-24 md:py-12 py-6 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className={`text-4xl ${bodoni.className}`}>My Appointments</h1>
                <p className="text-muted-foreground">Your past and upcoming bookings at Snip-it.</p>
            </div>
            
            <AppointmentsTable initialData={data} />
        </div>
    )
}

export default AppointmentsPage