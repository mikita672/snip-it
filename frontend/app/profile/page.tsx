import ProfileForm from "@/components/profile/ProfileForm";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { serverFetch } from "@/lib/fetch";
import { UserProfile } from "@/types/user/UserProfile";
import { UserReservationsPage } from "@/types/reservation/UserReservationPreview";
import { redirect } from "next/navigation";
import { Bodoni_Moda } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({ searchParams }: Props) {
  const paramsObj = await searchParams;
  const activeTab = (paramsObj.tab as string) || "profile";

  const profileResponse = await serverFetch("/api/user/profile", {
    method: "GET",
  });

  if (profileResponse.status === 401) {
    redirect("/login");
  }

  if (!profileResponse.ok) {
    return (
      <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
        <p className="text-center font-bold text-destructive">
          Failed to load profile
        </p>
      </div>
    );
  }

  const user: UserProfile = await profileResponse.json();

  const page = paramsObj.page ? parseInt(paramsObj.page as string) : 0;
  const size = paramsObj.size ? parseInt(paramsObj.size as string) : 5;
  const sort = paramsObj.sort ? (paramsObj.sort as string) : "reservationTime";
  const direction = paramsObj.direction
    ? (paramsObj.direction as string)
    : "desc";
  const search = paramsObj.search ? (paramsObj.search as string) : "";
  const status = paramsObj.status ? (paramsObj.status as string) : "";

  let appointmentsUrl = `/api/reservation/my-appointments?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  if (search) appointmentsUrl += `&search=${encodeURIComponent(search)}`;
  if (status) appointmentsUrl += `&status=${encodeURIComponent(status)}`;

  const appointmentsResponse = await serverFetch(appointmentsUrl, {
    method: "GET",
  });

  let appointmentsData: UserReservationsPage | null = null;
  if (appointmentsResponse.ok) {
    appointmentsData = await appointmentsResponse.json();
  }

  return (
    <div className="flex flex-col gap-8 md:px-24 md:py-12 py-6 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className={`text-4xl ${bodoni.className}`}>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full md:w-100 grid-cols-2 bg-muted/50">
          <TabsTrigger value="profile" asChild>
            <Link href="/profile?tab=profile">Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="appointments" asChild>
            <Link href="/profile?tab=appointments">Appointments</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={user} />
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
          {appointmentsData ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className={`text-2xl ${bodoni.className}`}>
                  My Appointments
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your past and upcoming bookings at Snip-it.
                </p>
              </div>
              <AppointmentsTable initialData={appointmentsData} />
            </div>
          ) : (
            <p className="text-center font-bold text-destructive">
              Failed to load appointments
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
